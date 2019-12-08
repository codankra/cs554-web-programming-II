
import React, { Component } from "react";
//Import Query from react-apollo
import "../App.css";
import { Query,Mutation} from "react-apollo";

import queries from "../queries";

const cssStyler = {
    imgSize: {
        height: "200px",
        width: "200px",
        marginTop: "50px"
    }
};
class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        imgBinned: false,
        // showAddModal: false,
        // showDeleteModal: false,
        editImage: null,
        deleteImage: null,
        pageNum: 1,
        // imageList: null
      };
    this.getMoreData = this.getMoreData.bind(this);

      
    }
  
    // }
    // componentWillMount() {
    //     <Query query={queries.GET_UNSPLASH_IMAGES} variables={ {pageNum: this.state.pageNum} }>
    //     {({ data, loading, error }) => {
    //           if (loading) return "Loading...";
    //           if (error) return `Error! ${error.message}`;
    //           if (!data.unsplashImages) {
    //             return null;
    //           }
    //           return data.unsplashImages; //get set to this
    //       }}
    //     </Query>
    //     console.log(returnable);
    //     this.setState({
    //         imageList: returnable.data});
    //   }
    getMoreData(){
        this.setState({ pageNum: this.state.pageNum + 1 });
    }
    // binSwap(id){
    //     //call updateImage with that ID
    // }
    render() {
        return (
        <div>
            <Query query={queries.GET_UNSPLASH_IMAGES} variables={{ pageNum: this.state.pageNum }}>
                {({ data, loading, error }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    if (!data.unsplashImages) {
                    return null;
                    }
                    return (
                        <div>
                        {data.unsplashImages.map(imagePost => {
                            return (
                            <div className="card" key={imagePost.id}>
                                <div className="card-img">
                                <img src={imagePost.url} alt="Ims" style={cssStyler.imgSize}></img>
                                </div>
                                <div className="card-body">
                                <h5 className="card-title">
                                {imagePost.poster_name}
                                </h5>
                                Description: {imagePost.description}
                                <br />
                                </div>
                                <Mutation mutation={queries.UPDATE_IMAGE}>
                                    {(updateImage, {data}) => (
                                    <button onClick={() => { updateImage({
                                        variables: {
                                            id: imagePost.id,
                                            url: imagePost.url,
                                            description: imagePost.description,
                                            posterName: imagePost.poster_name,
                                            userPosted: imagePost.user_posted,
                                            binned: (imagePost.binned === false)
                                    }})
                                    this.setState({deleteImage: 1});
                                    }}>
                                    {imagePost.binned ?  "Remove from" : "Add to"} Bin</button>
                                    )}
                                </Mutation>
                                
                            </div>
                            );
                        })}
                        <br />
                        <br />
                        <button onClick={this.getMoreData}>More Images</button>
                        <br />
                        <br />
                        </div>
                    );}}
            </Query>
        </div>
        );
    }
}
        
  
  export default Home;
