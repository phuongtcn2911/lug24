import {Storage} from "@google-cloud/storage";
import {v4 as uuidv4} from "uuid";

const credentials=JSON.parse(process.env.GOOGLE_CLOUD_STORAGE_ACC);

const storage=new Storage({
    projectId:credentials.project_id,
    credentials
});
//Thư mục lớn ~ Solution
const bucket=storage.bucket("lug-face");

export async function uploadFaceImg({
    orderID, customerID,type,buffer
}){
    const filePath=`${orderID}/${customerID}_${type}.jpg`;
    const file=bucket.file(filePath);
    await file.save(buffer,{
        contentType:"image/jpeg",
        resumable:false
    });
    return `gs://${bucket.name}/${filePath}`;
}
