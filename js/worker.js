onconnect = (e) => {
    const port = e.ports[0];
    
    port.onmessage = (event) => {
        port.postMessage(event.data);
    };
};