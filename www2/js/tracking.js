var currentPage = 0,
    lastPage = 0,
    curseStatus = '',
    curseCompleted = false,
    btnNext,
    btnPrev,
    content;

$(function(){

    btnNext = $('#btnNext');
    btnPrev = $('#btnPrev');    
    
    btnNext.hide(0);
    btnPrev.hide(0);

    content = $('#content');

    if (conection) {
        
        if (getAPI()) {
            checkProgress();
        } else {
            errorAPI();
            goPage(0);
        }

    } else {
        goPage(0);
    }

    $('#btnNext').click(function(){
        nextPage();
    });

    $("#btnPrev").click(function(){
        prevPage();
    });    
});

function loadContent() {
    content.html('<iframe name="com" id="com" src="' + contentPath + course.pages[currentPage].url + '" frameborder="0" scrolling="no" border="0"></iframe>');
    //$('title').text(course.pages[currentPage].title);
    //$("#com").mCustomScrollbar();
    updateTracking();
}

/*function checkProgress() {
    //Función para revisar el avance
}*/

function goPage(pageID) {

    if (currentPage != pageID) {
        lastPage = currentPage;
	}

    currentPage = pageID;
    loadContent();
}

function reLoad() {
    goPage(currentPage);
}

function goHome() {

	if (currentPage != 0) {
        goPage(0);
	}
}

function nextPage() {

	if ((currentPage + 1) < course.pages.length) {
		currentPage++;
		loadContent();
	} else {
		//console.log('Error - Ya no hay más páginas después');
	}
}

function prevPage() {

	if (currentPage > 0) {
		currentPage--;
		loadContent();
	} else {
		//console.log('Error - Ya no hay más páginas antes');
	}
}

function updateTracking() {
    
    if (conection) {
        // enviar aquí el "lesson_location"
        if (!curseCompleted) {
            if (currentPage == course.pages.length - 1) {
                
                // enviar aquí el "completed"
                curseCompleted = true;

            } else {
                // enviar aquí el "incomplete"
            }
        }   
        
        //var success = lmsCall("Commit");
        //if (!success){
        //    errorAPI();
        //}
    }

    //Actualización de los botones de navegación

    if (currentPage < course.pages.length - 1) {

        if (!navegationBlock) {
            $('#btnNext').show(0);
        }

    } else {
        $('#btnNext').hide(0);
    }

    if (currentPage >= 1) {
        $('#btnPrev').show(0);
    } else {
        $('#btnPrev').hide(0);
    }
}

function errorAPI(){
    if (mostrarAlertas) {
        alert('Se ha detectado un problema de comunicación con el LMS.\nSu progreso no podrá seguir siendo registrado.\nPor favor cierre el curso y vuelva a intentarlo.');
    }
    //console.log('Error de conexión');
}