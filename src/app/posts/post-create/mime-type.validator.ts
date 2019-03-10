import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

//this is a validator file. 
//all validators are just functions which read the control value and return the information that is valid or not
//both Promise and Observables are generic types so send what it should back
//mimeType should expect an argument of the file input. 

//validator will be async validator because in post-create.component.ts where it loads the file, you do not want the validator to block the javascript
//execution. so that's why it's handled asynchronously. 
//because the validator is an async validator. the return type has to be a special type of return. it needs to be either a Promise or Observable. 
//a simple synchronous validator would return a javsacript object where you can have key/value pair and value of that errorcode. if the errorcode is NULL, means there was no error. 
//for async validationats, the JS object is wrapped around a Promise or Observable. 
//{[key: string]: any} <<< this just means we expect a key of type string to be returned. we do not care what the name of the "key" is. and the value can be of type "any"
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    //if the imagepath is a string, meaning that EDIT was clicked where in that case it only loads the path as string, so this validator where it typically would
    //expect a file, if in fact it is a string, we just want to return it as this validator is true. meaning it's all good. 
    if (typeof(control.value) === 'string'){
        //immediately return an observable. "of". "of" is a quick easy way of adding/creating an observable which will emit the data immediately
        return of(null);//return a null value from this validator meaning the validator sent back true which is good. do return so that none of the code below runs
    }
    const file = control.value as File;//tell typescript that it is a file by doing "as File"
    const fileReader = new FileReader();
    //create your own Observable to return since simply defining a function would be synchrous return type and that's not what the validation here expects to return. it 
    //expects to return either a Promise or Observable, so create an observable by Observable.create()
    //an observer of type Observer should be passed in to the Observable. it will be the same type as what this validator is going to return
    const fileReaderObs = Observable.create((observer: Observer<{[key: string]: any}>)=>{
        //addEventListener("loadend") is equivalent to fileReader.loadend(). 
        //have a callback when the loadend event is done. 
        //loadend event listeners just provides more information than just onload
        fileReader.addEventListener("loadend", () => {
            //this function inside will run after fileReader.readAsArrayBuffer(). this is the callback so now you can validate the mime type inside here and return
            //Uint8Array will create an array of 8 unsite integers. this basically allows us to read certain patters in the file. not just the file name, but also the file 
            //metadata, that we can use to parse the mimetype. we don't just want to check the file extension since that could be changed, since you can upload a PDF as a JPG file
            //we want to look into that file and Uint8Array allows us to do this. 
            const arr = new Uint8Array(<ArrayBuffer>fileReader.result).subarray(0,4);//subarray(0,4) is the mimeType
            let header = '';
            let isValid = false; //we will assume at first the file is invalid. so we should set to true eventually if the file is of a mimetype we are looking for

            //need to read a certain patter from the arr, and you would use a for loop for that
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);//toString(16) will convert the string to a hexadecimal string
            }
            //these hexadecimal strings can be googled ofr mimetypes. these mimetype patterns are jpg and png filetypes exactly. 
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default: 
                    isValid = false
                    break;
            }
            if (isValid) {
                //next() emits a new value 
                observer.next(null);//a null valid emitted means the validator returned valid with no error code
            } else {
                observer.next({invalidMimeType: true});//you would emit a different value of an JS object which you can name whatever you want, which would mean it was not valid
            }
            observer.complete();//.complete() would let any subscribers know this observable has finished processing.
        });
        //this will run first. 
        fileReader.readAsArrayBuffer(file);
    })
    
    //fileReader.onloadend = () => {
    return fileReaderObs;//return the observable 
};