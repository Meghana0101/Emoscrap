import axios from 'axios'

export const  createEntries = (notes) => {
    const jwtToken =  localStorage.getItem('token');
    axios.post('http://localhost:4000/api/entries', 
        {
            text : notes
        },
        {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
    )
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error during POST request:', error);
    });
}
