 export default class Likes {
     constructor() {
         this.likes = [];
     }

     addLike(id, title, author, img) {
         const like = {
             id,
             title,
             author,
             img
         };
         this.likes.push(like);


         //Persist data
         this.persistData();
         return like;
     }

     deleteLike(id) {
         const index = this.likes.findIndex(el => el.id === id);
         this.likes.splice(index, 1);

         this.persistData();
     }

     isLiked(id) {
         return this.likes.findIndex(el => el.id === id) !== -1;
     }

     getNumLikes() {
         return this.likes.length;
     }

     persistData() {
         localStorage.setItem('likes', JSON.stringify(this.likes))
     }

     readLocaldata() {
         const data = JSON.parse(localStorage.getItem('likes'))

         //If there is data in local storage then we are resetting the likes to it.
         if (data) this.likes = data
     }
 }