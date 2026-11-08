const menuButton=document.querySelector('.menu-button');
const navigation=document.querySelector('#navigation');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');navigation.hidden=true;}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.hidden=!open;});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!navigation.hidden){closeMenu();menuButton.focus();}});
document.addEventListener('click',e=>{if(!navigation.hidden&&!navigation.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
const serviceSelect=document.querySelector('#service');
if(serviceSelect){
 const requestedService=new URLSearchParams(location.search).get('service');
 if([...serviceSelect.options].some(option=>option.value===requestedService)) serviceSelect.value=requestedService;
}
const contactForm=document.querySelector('#contact-form');
if(contactForm) contactForm.addEventListener('submit',e=>{
 e.preventDefault();
 const data=new FormData(e.currentTarget);
 const result=document.querySelector('#form-result');
 result.textContent=`Prototype only — inquiry not sent.\n\n${data.get('name')}${data.get('company')?' · '+data.get('company'):''}\n${data.get('email')}\n${data.get('service')}\n\n${data.get('message')}\n\nThis form will send to MAPS once a contact destination is connected.`;
 result.hidden=false;
});
