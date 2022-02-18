import { v4 as uuidv4 } from "uuid";
import { client } from "../client";

export const getInfo = () => {
  let userInfo =
    localStorage.getItem("user") !== "undefined" &&
    JSON.parse(localStorage.getItem("user"));

  return userInfo;
};

export const fetchUser = async () => {
  let userInfo = getInfo();
  if (!userInfo || !userInfo.id) {
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDP-nAkcMi63Al8V0raPRZF_HLQ1YqZjb4",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: localStorage.getItem("token"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = () => {
      if (res.ok) {
        res.json().then((data) => {
          if (data)
            userInfo = {
              email: data.users[0].email,
              id: data.users[0].localId,
            };
          localStorage.setItem("user", JSON.stringify(userInfo));
        });

        userInfo = getInfo();
      } else {
        return res.json().then((data) => {
          let errorMessage = "Something went wrong!";
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          return errorMessage;
        });
      }
    };
    data();
  }
  return userInfo;
};
export const likePostHelper = (type, post, user) => {
  if (type === "like") {
    client
      .patch(post._id)
      .setIfMissing({ like: [] })
      .insert("after", "like[-1]", [
        {
          _key: uuidv4(),
          userId: user?._id,
          postedBy: {
            _type: "postedBy",
            _ref: user?._id,
          },
        },
      ])
      .commit();
  } else if (type === "unlike") {
    client.fetch(`*[_id =="${post._id}"].like`).then((data) => {
      const removeLike = [`like[userId=="${user?._id}"]`];
      client.patch(post._id).unset(removeLike).commit();
    });
  }
};

export const addCommentHelper = async (postID, user, comment, func) => {
  await client
    .patch(postID)
    .setIfMissing({ comments: [] })
    .insert("after", "comments[-1]", [
      {
        comment,
        _key: uuidv4(),
        postedBy: { _type: "postedBy", _ref: user._id },
        createdAt: new Date().toISOString(),
      },
    ])
    .commit()
    .then(func);
};
export const deleteCommentHelper = async (postID, key, fetchPostDetail) => {
  await client
    .fetch(`*[_type == "post" && _id =="${postID}"].comments`)
    .then((data) => {
      const removeComment = [`comments[_key=="${key}"]`];
      client.patch(postID).unset(removeComment).commit();
    })
    .then(() => {
      fetchPostDetail && setTimeout(fetchPostDetail, 800);
    });
};
export const changeAvatarUser = async (user, url) => {
  await client.patch(user._id).set({ avatar: url }).commit();
};
export const savePostHelper = (type, post_id, user_id) => {
  if (type === "save") {
    client
      .patch(post_id)
      .setIfMissing({ save: [] })
      .insert("after", "save[-1]", [
        {
          _key: uuidv4(),
          userId: user_id,
          postedBy: {
            _type: "postedBy",
            _ref: user_id,
          },
        },
      ])
      .commit();
  } else if (type === "unsave") {
    client.fetch(`*[_id =="${post_id}"].save`).then((data) => {
      const removeSave = [`save[userId=="${user_id}"]`];
      client.patch(post_id).unset(removeSave).commit();
    });
  }
};
export const changedUserDetails = async (userID, data) => {
  await client.patch(userID).set(data).commit();
};
export const setUser = (data) => {
  if (!data) {
    return;
  } else {
    const { fullname, googleId, email } = data;
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: fullname,
        email,
        id: googleId,
      })
    );
    const doc = {
      _id: googleId,
      _type: "user",
      username: email.match(/^([^@]*)@/)[1],
      fullname: fullname,
      avatar: "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png",
      email: email,
    };
    client.createIfNotExists(doc);
  }
};
//

export const changePasswordHelper = (idToken, newpassword) => {
  //
  if (idToken) {
    console.log("IS AUTHOR");
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDP-nAkcMi63Al8V0raPRZF_HLQ1YqZjb4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          password: newpassword,
          returnSecureToken: true,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Something went wrong!";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.idToken);
        return "OK";
      })
      .catch((error) => {
        return error;
      });
  }
};

export const followHelper = (type, idFollower, idUserGetFollow) => {
  if (type === "follow") {
    client
      .patch(idUserGetFollow)
      .setIfMissing({ follower: [] })
      .insert("after", "follower[-1]", [
        {
          userId: idFollower,
          _key: uuidv4(),
          type: "follow",
          userinfo: {
            _type: "postedBy",
            _ref: idFollower,
          },
        },
      ])
      .commit();
      client
      .patch(idFollower)
      .setIfMissing({ following: [] })
      .insert("after", "following[-1]", [
        {
          userId: idUserGetFollow,
          _key: uuidv4(),
          type: "follow",
          userinfo: {
            _type: "postedBy",
            _ref: idUserGetFollow,
          },
        },
      ])
      .commit();
  } else if (type === "unfollow") {
    client.fetch(`*[_id =="${idUserGetFollow}"].follower`).then((data) => {
      const removeFollower = [`follower[userId=="${idFollower}"]`];
      client.patch(idUserGetFollow).unset(removeFollower).commit();
    });
    client.fetch(`*[_id =="${idFollower}"].following`).then((data) => {
      const removeFollowing = [`following[userId=="${idUserGetFollow}"]`];
      client.patch(idFollower).unset(removeFollowing).commit();
    });
  }
};
