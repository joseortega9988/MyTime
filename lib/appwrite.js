import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";

export const config = {
    endpoint : 'https://cloud.appwrite.io/v1' ,
    platform : 'com.reactnative.MyTime',
    projectId : '669088490013398a3f3c', 
    databaseId : '66908bb1002e0036d854',
    userCollectionId: '66908bf3003baa65f57c',
    videoCollectionId: '66908c3d001f01cbc7f5', 
    taskCollectionId: '66c72402003c1d37ffdd',
    storageId: '6690b35f0039a270168b',
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    taskCollectionId,
    storageId,
} = config ; 

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(endpoint) 
    .setProject(projectId) 
    .setPlatform(platform) 
;
const account = new Account(client);
const avatars = new Avatars (client);
const databases = new Databases (client);


// Register User

export const createUser = async (email,password,username) => {
    try {
        const newAccount = await account.create (
            ID.unique(),
            email,
            password,
            username
        )
        
        if(!newAccount) throw Error ;
        const avatarUrl = avatars.getInitials (username)

        await signIn(email,password);
        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique (),
            {
                accountId : newAccount.$id,
                email,
                username,
                avatar:avatarUrl
            }
        )
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error (error);
    }
}


export const signIn = async (email,password) => {
    try {
        const session = await account.createEmailPasswordSession (email,password)
        //await account.deleteSession("current");
        return session; 
    } catch (error){

    }
}

// Get Account
export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

export const getCurrentUser = async () => {
    try {
        const currentAccount = await getAccount();

        if (!currentAccount) throw new Error("No current account");

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id), Query.limit(1)]
        );

        if (!currentUser) throw new Error("No current user document");

        return currentUser.documents[0];

    } catch (error) {
        console.log(error);
        return null; // Return null if there's an error
    }
};

export async function signOut() {
    try {
        const session = await account.deleteSession ('current')
        return session
    } catch (error) {
        throw new Error (error)
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )

        return posts.documents ;
    }
    catch (error){
        throw new Error (error);
    }
}

export async function getLatestPosts() {
try {
    const posts = await databases.listDocuments(
    databaseId,
    videoCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    //console.log('Posts from Appwrite:', posts);
    return posts.documents;
} catch (error) {
    console.error('Error fetching latest posts:', error);
    throw new Error(error);
}
}


export async function SearchPosts(query) {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search("title", query), Query.limit(10)]  // Corrected usage of Query.search
        );
        return posts.documents;
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw new Error(error);
    }
}


export async function GetUserPosts (userId) {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal("creator", userId), Query.limit(1)]  // Corrected usage of Query.search
        );
        return posts.documents;
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw new Error(error);
    }
}


export const createTask = async (taskname, date, priority, description, creator ) => {
    try {
        // Create the task in the database
        const newTask = await databases.createDocument(
            databaseId, 
            taskCollectionId, 
            ID.unique(),
            {
                taskname,
                date,
                priority: [priority], // Store priority as an array
                description,
                status: false,
                creator,
            }
        );
        if (!newTask) throw Error;
        return newTask;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};


export async function GetUserTasks (userId) {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            taskCollectionId,
            [Query.equal("creator", userId), Query.limit(100)]  // Corrected usage of Query.search
        );
        //console.log('Fetched tasks:', posts.documents); // Log the fetched tasks
        return posts.documents;
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw new Error(error);
    }
}

export const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const updatedTask = await databases.updateDocument(
        databaseId, // Your database ID
        taskCollectionId, // Your collection ID
        taskId, 
        {
          status: newStatus, // Update the status attribute
        }
      );
      return updatedTask;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  };

  export const updateTask = async (taskId, taskname, date, priority, description) => {
    try {
        const updatedTask = await databases.updateDocument(
            databaseId, 
            taskCollectionId, 
            taskId,
            {
                taskname,
                date,
                priority: [priority], // Store priority as an array
                description
            }
        );
        return updatedTask;
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error(error);
    }
};


export const getTaskById = async (taskId) => {
    try {
      const task = await databases.getDocument(
        databaseId, 
        taskCollectionId, 
        taskId
      );
      return task;
    } catch (error) {
      console.error('Error fetching task by ID:', error);
      throw new Error(error);
    }
  };
  

