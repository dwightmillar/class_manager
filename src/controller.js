import { sendRequest } from "./utils.js"

const controller = {
    class: {
        load: async function() {
            let response = await sendRequest('GET','/api/classes')
            return response
        },
    
        add: async function(title) {
            let body = { name: title }
            let response = await sendRequest('POST', '/api/classes', { body })
            return response
        },
    
        delete: async function(classId) {
            let response = await sendRequest('DELETE','/api/classes', { body: { id: classId } })
            return response
        }
    },
    student: {
        load: async function(classId) {
            let response = await sendRequest('GET', `/api/students?classId=${classId}`)
            return response
            
        },
      
        add: async function(name, classId) {
            let body = { name, classId }
            let response = await sendRequest('POST', '/api/students', { body })
            return response
        },
      
        delete: async function(studentId) {
            const body = { id: studentId }
            let response = await sendRequest('DELETE','/api/students', { body })
            return response
        }
    },
    assignment: {
        load: async function(classId) {
            let response = await sendRequest('GET', `/api/assignments?classId=${classId}`)
            return response
        },
      
        add: async function(scores) {
            let body = { scores }
            let response = await sendRequest('POST', '/api/assignments', { body })
            return response
            
        },
      
        update: async function(scores) {
            let body = { scores }
            let response = await sendRequest('PATCH', '/api/assignments', { body })
            return response
        }
    }
}

export default controller