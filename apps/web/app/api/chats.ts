const BASE_URL = "http://localhost:5000";

function getToken() {
    return localStorage.getItem("token")
}




export async function getPersonalChat(userId: string) {


    const response = await fetch(`${BASE_URL}/personal/${userId}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });


    if (!response.ok) {
        throw new Error("Failed to get message")
    }

    return response.json();

}



export async function getUsers() {

    const response = await fetch(`${BASE_URL}/personal/users`, {
        headers: {
            Authorization: `Bearer ${getToken()}`

        }
    })
    console.log("GET USERS STATUS:", response.status); const data = await response.json(); console.log("GET USERS RESPONSE:", data);

    if (!response.ok) {
        throw new Error("Failed to get users");
    }

    return data;
}



