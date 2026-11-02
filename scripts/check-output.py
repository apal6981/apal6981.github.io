"""Validate generated local URLs, anchors, required content and exclusions."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import sys
root=Path(sys.argv[1]); base=sys.argv[2] if len(sys.argv)>2 else ''
class Page(HTMLParser):
 def __init__(self):
  super().__init__(); self.ids=[]; self.urls=[]; self.scripts=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for key in ('href','src'):
   if key in a:self.urls.append(a[key])
  if tag=='script' and 'src' in a:self.scripts.append(a['src'])
page=Page();page.feed((root/'index.html').read_text(encoding='utf-8'))
assert len(page.ids)==len(set(page.ids)), 'Duplicate IDs'
assert len(page.scripts)==len(set(page.scripts)), 'Duplicate scripts'
for section in ['introduction','projects','publications','research','experience','awards','contact']:assert section in page.ids, section
for url in page.urls:
 u=urlsplit(url)
 if u.scheme or u.netloc:continue
 if not u.path:
  if u.fragment:assert unquote(u.fragment) in page.ids,url
  continue
 assert u.path.startswith(base+'/'), f'Wrong baseurl: {url}'
 local=u.path[len(base):].lstrip('/')
 target=root/local
 if target.is_dir():target=target/'index.html'
 assert target.is_file(),f'Missing local resource: {url}'
 if u.fragment and local in ('','index.html'):assert unquote(u.fragment) in page.ids,url
for excluded in ['AGENTS.md','IMPLEMENTATION_PLAN.md','PRODUCT.md','DESIGN.md','README.md','VALIDATION.md','Gemfile','Gemfile.lock','about','scripts','.agents','.codex','.impeccable','.browser-qa','.browser-qa2','artifacts']:
 assert not (root/excluded).exists(),f'Published private file: {excluded}'
assert not (root/'2026').exists(),'Starter post published'
for pdf in ['GM_v2.pdf','SSS_poster.pdf','opengl_bellhop.pdf','opengl_bellhop_presentation.pdf','WiLiE.pdf','WiLiE_Presentation.pdf','3D_Reconstruction_of_Infant_Keepsakes_Report.pdf']:
 assert (root/'assets'/pdf).is_file(),f'Missing report: {pdf}'
for slug in ['hand-reconstruction','rc-racer','visual-odometry','baseball-catcher']:
 assert 'work-'+slug in page.ids,f'Missing new project: {slug}'
for video in ['https://www.youtube.com/watch?v=fXM8YLXXC4w','https://www.youtube.com/shorts/FXYg8f1PFv4','https://www.youtube.com/watch?v=24IoHJpjovY&feature=youtu.be']:
 assert video in page.urls,f'Missing supplied demo: {video}'
assert (root/'404.html').is_file()
print(f'PASS: {root}; {len(page.urls)} local/external URLs inspected; all sections, IDs, local resources and exclusions valid')
