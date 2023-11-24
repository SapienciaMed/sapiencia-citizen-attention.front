const urlBase = process.env.urlApiCitizenAttention;
//const urlBase = 'http://127.0.0.1:57962'

function getSuspender(promise) {
    let status = "pending";
    let response;
  
    const suspender = promise.then(
      (res) => {
        status = "success";
        response = res;
      },
      (err) => {
        status = "error";
        response = err;
      }
    );
  
    const read = () => {
      switch (status) {
        case "pending":
          throw suspender;
        case "error":
          throw response;
        default:
          return response;
      }
    };
  
    return { read };
  }
  
  export const fetchData = (url:string, id?:string) => {
    const parametro = id ? id:''
    const promise = fetch(`${urlBase}${url}${parametro}`)
      .then((response) => response.json());
  
    return getSuspender(promise);
  };