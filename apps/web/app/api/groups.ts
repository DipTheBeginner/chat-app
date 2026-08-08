const BASE_URL = "http://localhost:5000";


function getToken() {
    return localStorage.getItem("token");
}




export async function getMyGroups() {

    console.log("Entered getMyGroups");

    console.log("Token:", getToken());
    console.log("Before fetch");

    const response = await fetch(`${BASE_URL}/groups/my-groups`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }

    })

    console.log("After fetch");


    if (!response.ok) {
        throw new Error("Failed to fetch groups")
    }

    return response.json();
}



export async function getGroupMessages(groupId: string) {

    const response = await fetch(`${BASE_URL}/groups/${groupId}/messages`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to get message")
    }

    return response.json();


}



export async function createGroup(name: string) {

    const response = await fetch(`${BASE_URL}/groups`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },

        body: JSON.stringify({
            name,
        })
    })


    if (!response.ok) {
        throw new Error("Failed to create group")
    }

    return response.json()
}



export async function addMember(groupId: string, email: string) {
    const token = localStorage.getItem("token")



    const response = await fetch(`${BASE_URL}/groups/add-member`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
            groupId,
            email,
        }),


    })


    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/signup";
        return;
    }

    return response.json();

}


