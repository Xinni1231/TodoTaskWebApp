import axios from "axios";

const baseUrl = 'https://localhost:7235/api/';
export default {
    todo(url = baseUrl + 'todoitems/') {
        return {
            fetchAll: (sortName, filters) => axios.get(url + 'ids', {
                params: {
                    sortName,
                    filters
                }
            }),
            createNew: (record) => axios.post(url, record),
            updateTask: (record) => axios.put(url + record.id, record),
            deleteTask: (id) => axios.delete(url + id),
        }
    }
}