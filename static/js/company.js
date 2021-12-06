const submit = document.querySelector('.submit');

CKEDITOR.replace('content', {
    width: '100%',
    height: 350,
})

// submit.onclick = async () => {
//     const companyName = document.querySelector('#companyName');
//     const companyAddress = document.querySelector('#companyAddress');
//     const companyEmail = document.querySelector('#companyEmail');
//     const companyPhone = document.querySelector('#companyPhone');
//     const companyAddphone = document.querySelector('#companyAddphone');
//     const companyContent = document.querySelector('#companyContent');
//     const companyLogo = document.querySelector('#companyLogo');

//     if(
//         !companyName.value || !companyAddress.value || !companyPhone.value || 
//         !companyEmail.value || !companyLogo.files ||
//         !CKEDITOR.instances.companyContent.getData()
//     ) {
//         tabSelector.setPage(0);
//         document.querySelector('.error-handler').style.display = 'block';
//     }

//     let data = { 
//         name: companyName.value,
//         address: companyAddress.value,
//         email: companyEmail.value,
//         phone: companyPhone.value,
//         addPhone: companyAddphone.value ? companyAddphone.value : "",
//         content: CKEDITOR.instances.companyContent.getData(),
//         logo: new Blob([fs.readFileSync(companyLogo.files[0].path)])
//     }

//     let response = await fetch('/company/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json;charset=utf-8'
//         },
//         body: JSON.stringify(data)
//     });

//     console.log(await response.json());
// }