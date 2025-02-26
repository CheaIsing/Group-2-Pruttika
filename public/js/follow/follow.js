
let userId = sessionStorage.getItem("view-follow-id") || 1;
async function getFollower() {
    try {
        const {data} = await axiosInstance.get(`/follow/followers/${userId}`)

        console.log(data);
    
        const {data: followers} = data
    
        document.getElementById("followers").innerHTML = `
        `
        let html = ''
        if(followers.length > 0){
            followers.forEach(f=>{
               html += `
        <div class="list-group bg-white p-3 rounded-3" >
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center"> 
                                <img src="/uploads/${f.avatar}" alt="profile" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
                                <div class="ms-3">
                                    <h6 class="mb-0">${f.organizer.name ? f.organizer.name : f.name}</h6>
                                    <small class="text-muted">${f.role}</small>
                                </div>
                            </div>
                            
                            <button class="follow-btn btn-brand" onclick="removeFollowByOther(${f.id}, this)">Remove</button>
                        </div>
                    </div>`
            })
            document.getElementById("followers").innerHTML = html
    
        }
    } catch (error) {
        console.log(error);
        showToast()
    }

}

async function toggleFollow(id){
    try {

        const { data } = await axiosInstance.get(`/follow/followers/${userId}`);
        
        
        const isFollowing = data.some(follower => follower.id === id);
        
        if (isFollowing) {
            
            await axiosInstance.delete(`/follow/unfollow/${id}`);
            showToast('Unfollowed successfully');
        } else {
            
            await axiosInstance.post(`/follow/${id}`);
            showToast('Followed successfully');
        }
        
    } catch (error) {
        console.log(error);
        showToast()
    }
}

async function removeFollowByOther(id, list){
    try {
        await axiosInstance.delete(`/follow/remove-follower/${id}`);
        showToast(true, "Remove follow successfully.")
        list.closest("list-group").remove()
    } catch (error) {
        console.log(error);
        showToast()
    }
}

getFollower()