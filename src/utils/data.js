export const userQuery = (userId) => {
  const query = `*[_type == "user" && _id == '${userId}']`;
  return query;
};

// export const feedQuery = `*[_type == "post"]`;

export const feedQuery = `*[_type == "post"] | order(_createdAt desc) {
  _createdAt,
    images[]{
        _key,
      asset->{
        url
      }
    },
        _id,
        description,
        postedBy->{
          _id,
          username,
          avatar
        },
        save[]{
          _key,
          postedBy->{
            _id,
            username,
            avatar
          },
        },
        comments[]{
            _key,
            createdAt,
            postedBy->{
              _id,
              username,
              avatar
            },
            comment,
            like->{
                _id,
                username,
                avatar
            }
          },
        like[]{
            _key,
            postedBy->{
              _id,
              username,
              avatar
            },
          },
      } `;

export const postDetailQuery = (postId) => {
  const query = `*[_type == "post" && _id == '${postId}']{
    _createdAt,
    _id,
      images[]{
        asset->{
          url,
          _id
        },
        
      },
      description,
      postedBy->{
        _id,
        username,
        avatar
      },
      comments[]{
        comment,
        _key,
        createdAt,
        postedBy->{
          _id,
          username,
          avatar
        },
      },
      save[]{
        _key,
        postedBy->{
          _id,
          username,
          avatar
        },
      },
      like[]{
        _key,
        postedBy->{
          _id,
          username,
          avatar
        },
      },
    }`;
  return query;
};

// export const pinDetailMorePinQuery = (pin) => {
//   const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
//       image{
//         asset->{
//           url
//         }
//       },
//       _id,
//       destination,
//       postedBy->{
//         _id,
//         userName,
//         image
//       },
//       save[]{
//         _key,
//         postedBy->{
//           _id,
//           userName,
//           image
//         },
//       },
//     }`;
//   return query;
// };

// export const searchQuery = (searchTerm) => {
//   const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
//           image{
//             asset->{
//               url
//             }
//           },
//               _id,
//               destination,
//               postedBy->{
//                 _id,
//                 userName,
//                 image
//               },
//               save[]{
//                 _key,
//                 postedBy->{
//                   _id,
//                   userName,
//                   image
//                 },
//               },
//             }`;
//   return query;
// };

export const userCreatedPostQuery = (userId) => {
  const query = `*[ _type == 'post' && userId == '${userId}'] | order(_createdAt desc){
    _createdAt,
    _id,
      images[]{
        asset->{
          url,
          _id
        },
        
      },
      description,
      postedBy->{
        _id,
        username,
        avatar
      },
      comments[]{
        comment,
        _key,
        createdAt,
        postedBy->{
          _id,
          username,
          avatar
        },
      },
      save[]{
        _key,
        postedBy->{
          _id,
          username,
          avatar
        },
      },
      like[]{
        _key,
        postedBy->{
          _id,
          username,
          avatar
        },
      },
    }`;
  return query;
};

export const userSavedPostsQuery = (userId) => {
  const query = `*[_type == 'post' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    _id,
    description,
    hashtag,
    postedBy->{
      _id,
      username,
      avatar
    },
    images[]{
      _key,
    asset->{
      url
    }
  }
    }`;
  return query;
};
