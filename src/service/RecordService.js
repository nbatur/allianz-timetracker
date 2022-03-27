import axios from 'axios'

export class RecordService {
    getCustomersMedium() {
        return axios.get('assets/demo/data/customers-medium.json')
            .then(res => res.data.data);
    }

    getCustomersLarge() {
        return axios.get('assets/demo/data/customers-large.json')
                .then(res => res.data.data);
    }

    async getRecords(limit) {
        
        try {
          const response = await fetch('/records?offset=0&length='+ limit)
          const json = await response.json()        
    
          return json
        } catch (err) {
          console.log(err)
          return err;
        }
    }

    async getRecordsByEmail(email, limit) {
        try {
          const response = await fetch('/records?email=' + email + '&length='+ limit)
          
          try {
            const json = await response.json()    
            return json    
          } catch (e) {            
            return response.status + ' ' + response.statusText
          }
          
        } catch (err) {
          console.log(err)
          return err;
        }
    }

    async createRecord(record) {
        
      var form = new FormData();
      form.append('email', record.email);
      form.append('start', record.start);
      form.append('end', record.end);
      
      let result = await axios.post('/records', form)
        .then((response) => result = true)
        .catch((response) => result = false)

      return result;
    }
}