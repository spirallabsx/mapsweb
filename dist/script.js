const menuButton=document.querySelector('.menu-button');
const navigation=document.querySelector('#navigation');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');navigation.hidden=true;}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.hidden=!open;});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!navigation.hidden){closeMenu();menuButton.focus();}});
document.addEventListener('click',e=>{if(!navigation.hidden&&!navigation.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#service').value=a.dataset.service;}));
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const result=document.querySelector('#form-result');result.textContent=`Inquiry preview — not sent\n\n${data.get('name')}${data.get('company')?' · '+data.get('company'):''}\n${data.get('email')}\n${data.get('service')}\n\n${data.get('message')}\n\nThe live site will connect this form to MAPS. No inquiry has been submitted.`;result.hidden=false;});
