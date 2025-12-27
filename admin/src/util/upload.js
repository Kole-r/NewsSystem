import axios from "axios";

function upload(path, userForm) {
    const formData = new FormData();//因为涉及文件上传，所以用formdata
    for (let i in userForm) {
        formData.append(i, userForm[i]);
    }
    return axios.post(path, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }// 告知服务器这是一个文件上传请求
    }).then(res => res.data);
}
export default upload;