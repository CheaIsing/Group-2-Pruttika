let userId = null
async function getFollower() {
    // let userId = sessionStorage.getItem("view-follow-id") || 1;
    try {
        const {data: data3} = await axiosInstance.get("/auth/me");
        // console.log(data3);
        const {data: user} = data3
        
        userId = user.id

        // console.log(userId);
        

        const {data} = await axiosInstance.get(`/follow/followers/${userId}`)
        const {data: data2} = await axiosInstance.get("/follow/following/"+userId)


        // console.log(data2);
    
        const {data: followers} = data
        const {data: following} = data2
    
        document.getElementById("followers").innerHTML = `
        `
        let html = ''
        let html2 = ''

        if(followers.length > 0){
            followers.forEach(f=>{
               html += `
        <div class="list-group bg-white p-3 rounded-3 shadow-light-sm" >
                        <a class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center flex-grow-1 h-hover" onclick="showProfile(${f.id})" role="button"> 
                                <img src="/uploads/${f.avatar ? f.avatar : 'default.jpg' }" alt="profile" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
                                <div class="ms-3 w-100">
                                    <h6 class="mb-0"> ${f.organizer.name ? f.organizer.name : f.name}</h6>
                                    <small class="text-muted">${f.name + " &bull; "}${f.role}</small>
                                </div>
                            </div>
                            
                            <button class="btn btn-outline-brand bg-transparent px-3 fw-medium" style="height: auto !important;" onclick="removeFollowByOther(${f.id}, this)">${isEnglish ? "Remove":"ដកចេញ"}</button>
                        </a>
                    </div>`
            })
            document.getElementById("followers").innerHTML = html
    
        }else{
            document.getElementById("followers").innerHTML = `<div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">${isEnglish ? "No Follower to Display": "គ្មានអ្នកតាមដានដើម្បីបង្ហាញ"}</h4>
            </div>`
        }

        document.getElementById("following").innerHTML = ``
        
        if(following.length > 0){
            // console.log(following);
            
            following.forEach(f=>{
               html2 += `
        <div class="list-group bg-white p-3 rounded-3 shadow-light-sm" >
                        <div class="d-flex align-items-center justify-content-between" >
                            <div class="d-flex align-items-center flex-grow-1 h-hover" onclick="showProfile(${f.id})" role="button"> 
                                <img src="/uploads/${f.avatar ? f.avatar : 'default.jpg' }" alt="profile" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
                                <div class="ms-3 w-100">
                                    <h6 class="mb-0"> ${f.organizer.name ? f.organizer.name : f.name}</h6>
                                    <small class="text-muted">${f.name + " &bull; "}${f.role}</small>
                                </div>
                            </div>
                            
                            <button class="btn btn-outline-brand bg-transparent px-3 fw-medium" style="height: auto !important;" onclick="toggleFollow(${f.id}, this)">${getText("unfollow")}</button>
                        </div>
                    </div>`
            })
            document.getElementById("following").innerHTML = html2
    
        }else{
            document.getElementById("following").innerHTML = `<div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">${isEnglish ? "No Following to Display": "គ្មានការតាមដានដើម្បីបង្ហាញ"}</h4>
            </div>`
        }





    } catch (error) {
        // console.log(error);
        showToast()
    }

}

async function toggleFollow(id, btn){
    try {

        const { data } = await axiosInstance.get(`/follow/following/${userId}`);
        const {data: following} = data
        
        const isFollowing = following.some(follower => follower.id === id);
        // console.log(isFollowing);
        
        
        if (isFollowing) {
            await axiosInstance.delete(`/follow/unfollow/${id}`);
            showToast(true, getText("unfollowSuccess"));
            btn.innerText = getText("follow");
          } else {
            await axiosInstance.post(`/follow/${id}`);
            showToast(true, getText("followSuccess"));
            btn.innerText = getText("unfollow");
          }
        
    } catch (error) {
        // console.log(error);
        showToast()
    }
}

async function removeFollowByOther(id, list){

    
    try {
        await axiosInstance.delete(`/follow/remove-follower/${id}`);
        showToast(true, isEnglish ? "Remove follow successfully." : "លុបការតាមដានដោយជោគជ័យ")
        list.closest(".list-group").remove()
    } catch (error) {
        // console.log(error);
        showToast()
    }
}

getFollower()

function showProfile(id){
    // sessionStorage.setItem()
    sessionStorage.setItem("view-profile-id", id)
    window.location.href = "/profile/view-profile"
}