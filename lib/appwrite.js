import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.aora",
    projectId: "665b0fa5000f0d964c98",
    databaseId: "665b113c001b73db422b",
    userCollectionId: "665b116500354f53e78c",
    videoCollectionId: "665b11a9003bf37a6b22",
    storageId: "665b1399001f773d1506"
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) throw new Error('Account creation failed');

        const avatarUrl = avatars.getInitials(username);

        const session = await account.createEmailPasswordSession(email, password);
        if (!session) throw new Error('Session creation failed');

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
            },
            [], // read permissions
            [`user:${newAccount.$id}`] // write permissions


        );

        return newUser;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Sign In
export const signIn = async (email, password) => {
    try {
        // await account.deleteSession("current");
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const handleGuestLogin = async () => {
    try {
        const session = await account.createEmailPasswordSession("guest@123.com", "12341234");

        return session;
    } catch (error) {
        console.error("Guest login failed:", error);
    }
};

// Get Account
export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Current User
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error("Current account not found");
        // console.log(currentAccount, "currentAccount")
        // return currentAccount;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );
        // console.log(currentUser, "currentUser")

        if (!currentUser || currentUser.documents.length === 0) throw new Error("Current user not found");


        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Sign Out
export async function signOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

// Upload File
export async function uploadFile(file, type) {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                appwriteConfig.storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

// Create Video Post
export async function createVideoPost(form) {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}

// Get all video Posts
export async function getAllPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserPosts(userId) {
    try {


        // 모든 문서를 가져옵니다.
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId
        );

        // 클라이언트 측에서 필터링합니다.
        const userPosts = posts.documents.filter(post => post.creator.accountId === userId);

        if (userPosts.length === 0) {
            console.log("유저에 해당하는 posts가 없습니다", userId);
        }

        return userPosts;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw new Error(error);
    }
}

// Get video posts that matches search query
export async function searchPosts(query) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.search("title", query)]
        );

        if (!posts) throw new Error("Something went wrong");

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get latest created video posts
export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}
