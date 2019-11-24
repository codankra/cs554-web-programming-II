
import React, { Component } from "react";
//Import Query from react-apollo
import "../App.css";
import { Query,Mutation} from "react-apollo";

import queries from "../queries";

const cssStyler = {
    imgSize: {
        height: "200px",
        width: "200px"
    }
};
class BinList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        editImage: null,
        deleteImage: 0,
      };

      
    }
    render() {
        return (
        <div>
            <Query query={queries.GET_BINNED_IMAGES}>
                {({ data, loading, error }) => {
                    if (loading) return "Loading...";
                    if (error) return `Error! ${error.message}`;
                    if (!data.binnedImages) {
                    return null;
                    }
                    return (
                        <div>
                        {data.binnedImages.map(imagePost => {
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
                        </div>
                    );}}
            </Query>
        </div>
        );
    }
}
        
  
  export default BinList;
