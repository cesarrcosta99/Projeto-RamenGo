document.addEventListener('DOMContentLoaded',()=>{
    const image=document.querySelector('.image')
    const description=document.querySelector('.description')
    const button=document.querySelector('button')
    const getLocalStorage=JSON.parse(localStorage.getItem('orderData'))

    if(getLocalStorage) {
        image.src=getLocalStorage.image
        description.textContent=getLocalStorage.description
    }

    button.addEventListener('click',()=>{
        window.location.href='../orders/index.html'
    })
})