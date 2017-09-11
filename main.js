window.onload = function() {
    
    function check() {
        
        var firstQ = document.quiz.firstQ.value;
        var secondQ = document.quiz.secondQ.value;
        var thirdQ = document.quiz.thirdQ.value;
        var correct = 0;
        
        if(firstQ == "Warszawa") {
            correct++;
        } else if(secondQ == "Warren Buffett") {
            correct++;
        } else if(thirdQ == "JavaScript") {
            correct++;
        }
        
        
        
        
        
        var afterSubmit = document.getElementsByClassName("afterSubmit");
        afterSubmit.style.visibility = "visible";
        
        var correctNumb = document.getElementsByClassName("correctNumb");
        correctNumb.innerHTML = "You've got " + correct + " correct";
    }
}
