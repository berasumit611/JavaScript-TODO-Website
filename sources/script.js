//JS load afterothes finish loading
window.addEventListener('load',()=>{
    const form=document.querySelector('#new-task-form');
    const input=document.querySelector('#new-task-input');

    const tasksElement=document.querySelector('#tasks');
    
    const filters=document.querySelectorAll(".filters span");

    //*---------- 1> attached event listner to form & render data----------

    // We can attach the addEventListener to the form variable and listen for a submit event. This event listener allows us to attach a callback function which gets triggered once the form is submitted.

    form.addEventListener('submit',(e)=>{

        e.preventDefault();//prevent reload

        const taskData=input.value; //access form input data
        if(!taskData){
            alert("You must add atask!");
            return;
        }

        const taskElement=createTaskElement(taskData);//calling a function to crate each task element
        
        tasksElement.appendChild(taskElement); //#tasks > .task

        input.value=""; //clear input field after submit

        save_tasks_to_local_storage();


    });

    //*---------- 2> crate each corresponging task element  ----------

    function createTaskElement(taskData){
        const each_task_element=document.createElement('div');
        each_task_element.classList.add('task'); //<div class="task">

        const actions_element=document.createElement('div');
        actions_element.classList.add('actions'); //.task > .actions

        // 3 action icon
        const check_icon=document.createElement('i');
        check_icon.classList.add("task_content_icon",
        "fa-solid",
        "fa-circle-check","check");
        
        const delete_icon=document.createElement('i');
        delete_icon.classList.add('fa-solid', 'fa-circle-minus', 'delete');
        delete_icon.style.color="#960018";
        
        const edit_icon=document.createElement('i');
        edit_icon.classList.add('fa-regular', 'fa-pen-to-square', 'edit');
        edit_icon.setAttribute("data-info","edit");//this is added to toggle b/w edit and save
     
        //.actions > .check , .delete, .edit
        actions_element.appendChild(check_icon);
        actions_element.appendChild(delete_icon);
        actions_element.appendChild(edit_icon)
        
        
        const output_element=document.createElement('input');//<input>
        output_element.type = "text";
        output_element.classList.add("text");
        output_element.value = taskData;
        output_element.readOnly = true;                            

        //.task > .actions, <input>
        each_task_element.appendChild(actions_element);
        each_task_element.appendChild(output_element);                           
                                  
       //!adding action funcionality
       check_icon.addEventListener('click',()=>{
        output_element.classList.toggle('checked');//add line through and use for later to find complited and pending element
        check_icon.classList.toggle('color');
        save_tasks_to_local_storage();
       });
       delete_icon.addEventListener('click',()=>{
        tasksElement.removeChild(each_task_element);
        save_tasks_to_local_storage();
       });
       edit_icon.addEventListener('click',()=>{
        if(edit_icon.dataset.info=='edit'){
            output_element.focus();
            output_element.readOnly=false;
            edit_icon.setAttribute("data-info","save");
            edit_icon.classList.add('color');
            save_tasks_to_local_storage();
        }
        else{
            output_element.readOnly=true;
            edit_icon.setAttribute("data-info","edit");
            edit_icon.classList.remove('color');
            save_tasks_to_local_storage(); // Move the save to local storage inside else
            }
       });

       //return created task element
        return each_task_element;
    }
    
    //*---------- 3> toggle between filter & filter functionality----------
   
    //forEach method to iterate over each element in the filters NodeList. The filters NodeList contains all the span elements 
    filters.forEach((span)=>{
        // for each span event handler added
        span.addEventListener('click',function(){
            //before adding target span class-"active", for each span I remove active class
            filters.forEach((span)=>{
                span.classList.remove('active');
            });
            this.classList.add('active');

            //filter tasks function calling
            filter_tasks();
        });
    });

    function filter_tasks(){
        //step 1 - get the ID of the active filter
        const filter=document.querySelector('.filters .active').id;//filters > active > get corresponding ID

        // step 2 - get all the task elements as an array
        const array_of_tasks= Array.from(tasksElement.querySelectorAll('.task'));

       //step 3 - loop through each task to apply the selected filter
       array_of_tasks.forEach((each_tasks_element)=>{
        switch(filter){
            //if the active filter is "all" then display all tasks
            case "all":
                each_tasks_element.style.display="flex";
                break;
            case "pending":
                if(each_tasks_element.querySelector('.text').classList.contains("checked")){
                    each_tasks_element.style.display="none";//hide completed tasks
                }
                else{
                    each_tasks_element.style.display="flex"; //display pending tasks
                }
                break;
            case "completed":
                if(each_tasks_element.querySelector('.text').classList.contains("checked")){
                    each_tasks_element.style.display="flex";//show completed tasks
                }
                else{
                    each_tasks_element.style.display="none"; //hide not completed tasks
                }
                break;
            case "clear-all":
                tasksElement.removeChild(each_tasks_element);
                localStorage.clear();
                break;
        }
       });

    };

    //*---------- 4> save data to local storage function  ----------
    
    function save_tasks_to_local_storage(){
        const array_of_tasks=Array.from(tasksElement.querySelectorAll(".task"));
       
        const array_of_objects=array_of_tasks.map((indivual_task_element)=>{
            const task_output_element=indivual_task_element.querySelector(".text");
            return {
                task: task_output_element.value,
                completed: task_output_element.classList.contains('checked')
            };
        });
        
        localStorage.setItem("SAVED_TASKS",JSON.stringify(array_of_objects));
    };

    //*---------- 5> load data from local storage function ----------
    function load_tasks_from_local_storage(){
        // Step 1: Retrieve the saved tasks from local storage
        const savedTasks = localStorage.getItem("SAVED_TASKS");
      
        // Step 2: If there are saved tasks in local storage
        if (savedTasks) {
          // Step 3: Parse the JSON data into a JavaScript array (taskList)
          const taskList = JSON.parse(savedTasks);
      
          // Step 4: Iterate through each task in the taskList array
          taskList.forEach(task => {
            // Step 5: Create a task element using the createTaskElement function, passing the task data
            const taskElement = createTaskElement(task.task);
      
            // Step 6: If the task is completed (task.completed is true)
            if (task.completed) {
              // Step 7: Find the input element with the class "text" inside the task element
              const taskInput = taskElement.querySelector('.text');
      
              // Step 8: Add the class "checked" to the taskInput element
              taskInput.classList.add("checked");
      
              // Step 9: Find the icon with class "task_content_icon" inside the task element and add the class "color" to it
              taskElement.querySelector('.task_content_icon').classList.add("color");
            }
      
            // Step 10: Append the taskElement to the listElement (the task list container)
            tasksElement.appendChild(taskElement);
          });
        }
      
        // Step 11: After loading tasks from local storage, apply the selected filter to display relevant tasks
        filter_tasks();
      }
    
    //*---------- 6> load saved data whwn js file load ----------
    load_tasks_from_local_storage();


//---------- END ----------
})

