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
 const form=e.currentTarget;
 const button=form.querySelector('button[type="submit"]');
 const result=document.querySelector('#form-result');
 button.disabled=true;
 // Submit in the background; this preview shows confirmation after one second.
 fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}}).catch(()=>{});
 setTimeout(()=>{
  form.hidden=true;
  result.innerHTML='<span class="sent-check" aria-hidden="true">✓</span><strong>Inquiry sent.</strong><br><br>Thank you. We will be in touch shortly.';
  result.hidden=false;
 },1000);
});
