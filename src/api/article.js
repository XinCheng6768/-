import request from "@/utils/request"

export const getArticleList = params =>
    request.get('/admin/interview/query', { params })
// params:{} 查询参数
// data :{} 请求体参数
export const addArticle = data =>
    request.post('/admin/interview/create', data)

export const delArticle = id =>
    request.delete('/admin/interview/remove', {
        data: { id }
    })

export const getArticle = id =>
    request.get('/admin/interview/show', { params: { id } })

export const updateArticle = data =>
    request.put('/admin/interview/update', data)

