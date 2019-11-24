import gql from "graphql-tag";

const GET_UNSPLASH_IMAGES = gql`
  query getUnsplashImages($pageNum: Int){
    unsplashImages(pageNum: $pageNum) {
      id
      url
      poster_name
      description
      user_posted
      binned
    }
  }
`;

const GET_BINNED_IMAGES = gql`
  query {
    binnedImages {
        id
        url
        poster_name
        description
        user_posted
        binned
    }
  }
`;

const GET_USER_POSTED_IMAGES = gql`
  query {
    userPostedImages {
        id
        url
        poster_name
        description
        user_posted
        binned
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation uploadAnImage(
    $url: String!
    $description: String!
    $posterName: String!
  ) {
    uploadImage(
        url: $url,
        description: $description
        posterName: $posterName
    ) {
        id
        url
        poster_name
        description
        user_posted
        binned
    }
  }
`;

const UPDATE_IMAGE = gql`
mutation updateAnImage(
  $id: ID!
  $url: String
  $posterName: String
  $description: String
  $userPosted: Boolean
  $binned: Boolean
) {
  updateImage(id: $id, 
    url: $url, posterName: $posterName, description: $description, user_posted: $userPosted, 
    binned: $binned) {
      id
      url
      poster_name
      description
      user_posted
      binned
  }
}
`;

const DELETE_IMAGE = gql`
  mutation deleteAnImage(
    $id: ID!
  ) {
    deleteImage(
        id: $id
    ) {
        id
        url
        poster_name
        description
        user_posted
        binned
    }
  }
`;

export default {
  GET_UNSPLASH_IMAGES,
  GET_BINNED_IMAGES,
  GET_USER_POSTED_IMAGES,
  UPLOAD_IMAGE,
  UPDATE_IMAGE,
  DELETE_IMAGE
};