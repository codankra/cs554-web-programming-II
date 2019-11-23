const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');
const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();
const flat = require("flat");
const unflatten = flat.unflatten;
const uuid = require("node-uuid");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

function convert_to_array(arg){
  let unflattenedImages = unflatten(arg);
  var result = [];
  for (var i in unflattenedImages) result.push(unflattenedImages[i]);
  return result;
}

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).

  type ImagePost {
    id: ID!
    url: String!
    poster_name: String!
    description: String
    user_posted: Boolean!
    binned: Boolean!
}

  type Query {
    books: [Book]
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }
  type Mutation {
    uploadImage(
        url: String!, 
        description: String, 
        posterName: String
    ): ImagePost
    updateImage(
        id: ID!, 
        url: String, 
        posterName: String, 
        description: String, 
        user_posted: Boolean, 
        binned: Boolean
    ): ImagePost
    deleteImage(
        id: ID!
    ): ImagePost
  }
`;
// use https://api.unsplash.com/photos?page=1
const books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
    },
  ];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            let datable = [];
            for (let i = 1;i<=args.pageNum;i++){
              const response = await axios.get(
                `https://api.unsplash.com/photos?client_id=4612f5cd19e4f63eaa3ede4c7cf8c4872b58fa4a9388b1020c0488441eb9d017&page=${i}`
              );
              let ImagePostsArr = response.data.map(function (obj) {
                let ImagePostN = {
                    id: obj.id,
                    url: obj.urls.full,
                    poster_name: obj.user.name,
                    description: obj.description,
                    user_posted: false,
                    binned: (obj.liked == "true")
                }
                return ImagePostN;
              });
              datable = datable.concat(ImagePostsArr);
            }
            return datable;
            
        },
        // [(binned) -> [binned, binned,...], (posted) ->  [posted,posted, ...]]
        binnedImages: async () => {
          let myImages = await client.hgetallAsync("binned");
          let unImage = unflatten(myImages);
          let JSONToList = [];
          for (var i in unImage){
            JSONToList.push(unImage[i]);
            unImage[i].binned = true;
            unImage[i].user_posted = (unImage[i].user_posted == "true");
          }
          return JSONToList;
        },
        userPostedImages: async () => {
          let myImages = await client.hgetallAsync("posted");
          let unImage = unflatten(myImages);
          let JSONToList = [];
          for (var i in unImage){
            JSONToList.push(unImage[i]);
            unImage[i].user_posted = true;
            unImage[i].binned = (unImage[i].binned == "true");
          }
          return JSONToList;
        }
    },
    Mutation: {
      uploadImage: async (_, args) => {
        let newImagePost = {
          id: uuid.v4(),
          url: args.url,
          description: args.description,
          poster_name: args.posterName,
          user_posted: true,
          binned: false
        };
        let idAlreadyExists = await client.existsAsync("posted");
        if(idAlreadyExists){
          let cachedIMGs = await client.hgetallAsync("posted"); 
          let unflattable = unflatten(cachedIMGs); 
          let currentIndex = Object.keys(unflattable).length;
          unflattable[currentIndex] = newImagePost;
          let setable = flat(unflattable); 
          await client.hmsetAsync("posted", setable);
        }else{
          let newList = []
          newList.push(newImagePost);
          const flatable = flat(newList);
          await client.hmsetAsync("posted", flatable);
        }
        return newImagePost;
    },
    updateImage: async (_, args) => {
      let postedImages = await client.hgetallAsync("posted");
      let binnedImages = await client.hgetallAsync("binned");
      let resultP = convert_to_array(postedImages);
      let resultB = convert_to_array(binnedImages);
      let imageP = resultP.find(elem => elem.id === args.id);
      let imageB = resultB.find(elem => elem.id === args.id);
      let returnable = [];
      if (imageP) { //in posted
        let imagePin = resultP.findIndex(elem => elem.id === args.id);
        postedImages[imagePin] = {
          id: args.id,
          url: args.url ? args.url : imageP.url,
          poster_name: args.posterName ? args.posterName : imageP.url,
          description: args.description ? args.description : imageP.description,
          user_posted: args.userPosted ? args.userPosted : imageP.user_posted,
          binned: args.binned ? args.binned : imageP.binned
        };
        if (args.binned != imageP.binned){
          if (args.binned == true){
            resultB.push(imageP);
          } else if (args.binned == false) {
            const index = resultB.findIndex(imageP);
            resultB.splice(index, 1);
          }
        }
        //can finalize posted here
        let flattenedImagesP = flat(resultP); //flatten image
        await client.hmsetAsync("posted", flattenedImagesP);
        returnable = postedImages[imagePin];
      }
      if (imageB){ //in binned
        if(args.binned != imageB.binned){
          const index = resultB.findIndex(elem => elem.id === args.id);
          resultB.splice(index, 1); 
        }
        returnable = imageB;
        returnable.binned = (args.binned == true);
      }
      if(!imageB){
        let newImagePost = {
          id: args.id,
          url: args.url,
          poster_name: args.posterName,
          description: args.description,
          user_posted: args.user_posted,
          binned: args.binned
        };
        if(args.binned == true){
          resultB.push(newImagePost);
        }
        returnable = newImagePost;
      }
      if(resultB.length == 0) client.delAsync("binned");
      else{
        let flattenedImagesB = flat(resultB); //flatten image
        await client.hmsetAsync("binned", flattenedImagesB); //set new data again
      }
      return returnable;
    },
    deleteImage: async (_, args) => {
      let resultP = getPosted();
      const index = resultP.findIndex(elem => elem.id === args.id); 
      resultP.splice(index, 1); 
      if(resultP.length == 0) client.delAsync("posted");
      else{
        let flattenedImages = flat(resultP); 
        await client.hmsetAsync("posted", flattenedImages);
      }
      /*remove if also in liked */
      let resultB = getBinned();
      const index2 = resultB.findIndex(elem => elem.id  === args.id);
      if (index2 >= 0) {
        resultB.splice(index2, 1); 
      }
      if(resultB.length == 0) client.delAsync("binned");
      else{
        let flattenedImagesB = flat(resultB); //flatten image
        await client.hmsetAsync("binned", flattenedImagesB); //set new data again
      }
    }
  }
    
  };

  
  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});