const BASE_URL="http://localhost:5000";



export async function signup(username:string , email:string , password: string) {

    const response=await fetch(`${BASE_URL}/api/auth/signup`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",

        },
        body:JSON.stringify({
            username,
            email,
            password,
        })


    })

    

    return response.json();



    
}


export async function login(email:string , password : string) {


    const response = await fetch(`${BASE_URL}/api/auth/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },

        body:JSON.stringify({
            email,
            password
        })


    })

    return response.json()

    
}
