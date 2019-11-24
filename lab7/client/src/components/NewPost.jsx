// import React, { Component } from "react";
// //Import Query from react-apollo
// import { Query, Mutation } from "react-apollo";

// //Import the file where my query constants are defined
// import queries from "../queries";

// /* The React Apollo package grants access to a Query component, which takes a query as prop and executes it when its rendered. 
// That’s the important part: it executes the query when it is rendered. 
// It uses React’s render props pattern, using a child as a function implementation where you can access the result of the query as an argument.
// */
// class NewPost extends Component {
//   render() {
//     let body;
//     //check which add modal they are trying to get to and then render the form, mutation/query accordingly
//     //if Add Employe
//       let posterName;
//       let url;
//       let description;
//       body = (
//         <Mutation
//           mutation={queries.UPLOAD_IMAGE}
//           update={(cache, { data: { uploadImage } }) => {
//             const { ImagePosts } = cache.readQuery({
//               query: queries.UPLOAD_IMAGE
//             });
//             cache.writeQuery({
//               query: queries.UPLOAD_IMAGE,
//               data: { employees: employees.concat([addEmployee]) }
//             });
//           }}
//         >
//           {(addEmployee, { data }) => (
//             <form
//               className="form"
//               id="add-employee"
//               onSubmit={e => {
//                 e.preventDefault();
//                 addEmployee({
//                   variables: {
//                     posterName: posterName.value,
//                     url: url.value,
//                     description: description.value
//                   }
//                 });
//                 posterName.value = "";
//                 url.value = "";
//                 description.value = "1";
//                 alert("Post Added");
//                 this.props.handleClose();
//               }}
//             >
//               <div className="form-group">
//                 <label>
//                   Poster Name:
//                   <br />
//                   <input
//                     ref={node => {
//                       posterName = node;
//                     }}
//                     required
//                     autoFocus={true}
//                   />
//                 </label>
//               </div>
//               <br />
//               <div className="form-group">
//                 <label>
//                   URL:
//                   <br />
//                   <input
//                     ref={node => {
//                       url = node;
//                     }}
//                     required
//                   />
//                 </label>
//               </div>
//               <div className="form-group">
//                 <label>
//                   Description:
//                   <br />
//                   <input
//                     ref={node => {
//                       url = node;
//                     }}
//                     required
//                   />
//                 </label>
//               </div>
//               <br />
//               <button className="button add-button" type="submit">
//                 Add Image Post
//               </button>
//             </form>
//           )}
//         </Mutation>
//       );

//     return (
//       <div>
//           {body}
//       </div>
//     );
//   }
// }

// export default NewPost;