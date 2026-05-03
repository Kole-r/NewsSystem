import axios from '../util/axios.config.js';

function upload(path, userForm, method = 'post') {
    const formData = new FormData();//因为涉及文件上传，所以用formdata
    for (let i in userForm) {
        if (i === 'file') continue; // 单独处理文件字段
        formData.append(i, userForm[i]);
    }
    if (userForm.file) {
        formData.append('file', userForm.file); // multer 通过 upload.single('file') 接收
    }
    const config = {
        headers: {
            "Content-Type": "multipart/form-data"
        }// 告知服务器这是一个文件上传请求
    };
    if (method === 'put') {
        return axios.put(path, formData, config).then(res => res.data);
    }
    return axios.post(path, formData, config).then(res => res.data);
}
export default upload;