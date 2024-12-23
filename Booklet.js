
class Booklet{

    constructor(booklet){
        this.target = booklet;

        // this.target.addEventListener('click',(event)=>{this.onclick(event)})

        this.pagePrev = null;
        this.pageCurr = null;
        this.pageNext = null;
        this.pages = [];
        this.reset();
        this.triggerSync();
    }

    reset(){
        this.pagePrev=null;
        this.pageCurr=null;
        this.pageNext=null;
        this.init()
        this.setPageByIdx(0);
    }

    init(){
        this.pages = this.target.querySelectorAll('.booklet-page')
        this.pages.forEach((page,idx) => {
            page.dataset.idx = idx;
        });
        this.appendContentBtns();
        this.target.classList.add('on')
    }

    appendContentBtns(){
        this.target.querySelectorAll('.booklet-page-side').forEach((part)=>{
            const content = part.querySelector('.booklet-content');
            if(!content) return;
            const side_type = part.dataset.side??'single';
            if(!content.classList.contains('no-btn-detail') && !content.querySelector('booklet-btn-detail')){
                let btn = document.createElement('button')
                btn.classList.add('booklet-btn-detail','booklet-content-btn','clickable');
                btn.addEventListener('click',(evnet)=>{ this.detail(evnet.target.closest('.booklet-page-side'))})
                content.append(btn)
            }
            if(side_type == 'left' && !content.classList.contains('no-btn-prev') && !content.querySelector('booklet-btn-prev')){
                let btn = document.createElement('button')
                btn.classList.add('booklet-btn-prev','booklet-btn-turn','booklet-content-btn','clickable');
                btn.addEventListener('click',(evnet)=>{ this.prev()})
                content.append(btn)
            }
            if(side_type == 'right' && !content.classList.contains('no-btn-next') && !content.querySelector('booklet-btn-next')){
                let btn = document.createElement('button')
                btn.classList.add('booklet-btn-next','booklet-btn-turn','booklet-content-btn','clickable');
                btn.addEventListener('click',(evnet)=>{ this.next()})
                content.append(btn)
            }
        })
    }
    setPageByIdx(idx){
        idx = parseInt(idx,10)
        let pages = this.pages
        if(!pages || !pages.length){ return; }
        pages.forEach((page,idx) => {
            delete page.dataset.state;
        });
        this.pagePrev=null;
        this.pageCurr=null;
        this.pageNext=null;

        if(idx !==null && pages[idx]){
            pages[idx].dataset.state = 'curr';
            this.target.dataset.idx = this.pageIdx = idx;
            this.pageCurr = pages[idx];
            this.setPagePrevByIdx(idx-1);
            this.setPageNextByIdx(idx+1);            
        }

        this.triggerSync();
    }

    triggerSync(){
        const sync = new CustomEvent("booklet.sync", { detail: {"booklet":this}, });
        this.target.dispatchEvent(sync);
    }

    setPagePrevByIdx(idx){
        if(!this.pages[idx]) return false;
        if(this.pagePrev) delete this.pagePrev.dataset.state;
        this.pages[idx].dataset.state = 'prev';
        this.pagePrev = this.pages[idx];
        return this.pagePrev;
    }
    setPageNextByIdx(idx){
        if(!this.pages[idx]) return false;
        if(this.pageNext) delete this.pageNext.dataset.state;
        this.pages[idx].dataset.state = 'next';
        this.pageNext = this.pages[idx];
        return this.pageNext;
    }
    change(idx){
        if(idx == this.pageIdx){return false;}
        else if(idx < this.pageIdx){
            this.target.dataset.action='to-prev';
            this.pageCurr.addEventListener("animationend", (event) => {
                this.target.dataset.action='';
                this.setPageByIdx(idx);
            },{once:true});
        }
        else if(idx > this.pageIdx){
            this.target.dataset.action='to-next';
            this.pageCurr.addEventListener("animationend", (event) => {
                this.target.dataset.action='';
                this.setPageByIdx(idx);
            },{once:true});
        }
    }
    prev(idx=null){
        if(idx !== null){ if(!this.setPagePrevByIdx(idx)){console.warn('이동할 이전 페이지가 없습니다.'); return false;} }
        if(!this.pagePrev){ console.warn('이전 페이지가 없습니다.'); return false; }
        this.change(this.pagePrev.dataset.idx)
        
    }
    next(idx=null){
        if(idx !== null){ if(!this.setPageNextByIdx(idx)){console.warn('이동할 다음 페이지가 없습니다.'); return false;} }
        if(!this.pageNext){ console.warn('다음 페이지가 없습니다.'); return false; }
        this.change(this.pageNext.dataset.idx)
    }
    page(idx){       
        if(idx == this.pageIdx){return false;}
        else if(idx < this.pageIdx){this.prev(idx)}
        else if(idx > this.pageIdx){this.next(idx)}
    }
    first(){
        let idx = 0;
        this.page(idx);
    }
    last(){
        let idx = this.length -1;
        this.page(idx);
    }
    get length(){
        return this.pages.length
    }

    detail(part){
        const content = part.querySelector('.booklet-content');
        const img = part.querySelector('.booklet-content-img');
        console.log('재선언해서 도작하도록 하자',content,img);
        
    }

    //@deprecatd
    // onclick(event){
    //     const target = event.target
    //     const clickable_target = target.closest('.clickable')
    //     if(clickable_target){
    //         if(target.classList.contains('booklet-content')){
    //             if(target.closest('.booklet-page-side.left')){
    //                 this.prev();
    //             }
    //             if(target.closest('.booklet-page-side.right')){
    //                 this.next();
    //             }
    //         }else if(target.classList.contains('clickable')){
    //             this.target.dispatchEvent((new CustomEvent("booklet.click", { 
    //                 detail: {
    //                     "booklet":this,
    //                     "target":target,
    //                     "content":target.closest('.booklet-content'),
    //                     "part":target.closest('.booklet-page-side')
    //                 }, 
    //             })));
    //         }
    //     }
    // }
}