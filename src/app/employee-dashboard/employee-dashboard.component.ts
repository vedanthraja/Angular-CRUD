import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeModel } from './employee-dashboard.model';
import { ApiService } from '../shared/api.service';
@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  chosenFile !: any;
  employeeModelObj : EmployeeModel = new EmployeeModel();
  imgString !: String;
  formValue !: FormGroup;
  showAdd !: boolean;
  showUpdate !: boolean;
  imgStringModal !: String;
  imgStringEditForm !: String;
  employeeData !: any;
  showUploadField !: boolean;
  multipleEmployees : EmployeeModel[] = [];
  constructor(private formbuilder : FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      empImg : [''],
      empName : ['',[Validators.required]],
      email : ['',[Validators.email]],
      // email : [''],
      mobile : ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
      // mobile : [''],
      salary : ['', [Validators.required]]
      // salary : ['']
    }
    // this.formValue = new FormControl {
    //   empImg : new FormControl
    // }
    
    )
    this.multipleEmployees.push(this.employeeModelObj);
    this.getAllEmployee();
  }
  // get f() { return this.formValue.controls; }
  clickAddEmployee() {
    this.formValue.reset();
    this.showUploadField = true;
    this.showAdd = true;
    this.showUpdate = false;
  }
  onSubmit()  {
    this.employeeModelObj = new EmployeeModel();
    this.employeeModelObj.empImg = this.imgString;
    // console.log(this.imgString);
    this.employeeModelObj.empName = this.formValue.value.empName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;
  }
  postEmployeeDetails() {
    this.employeeModelObj = new EmployeeModel();
    if(!Boolean(this.imgString)) //Returns true if the string is null
    {
      this.employeeModelObj.empImg='';
    }
    else
    {
      this.employeeModelObj.empImg = this.imgString;
    }
    this.employeeModelObj.empName = this.formValue.value.empName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;

    //API Call
    this.api.postEmployee(this.employeeModelObj)
    .subscribe(res=>{
      console.log(res);
      alert("Employee Added Successfully");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee();
    },
    err=> {
      alert("Something went wrong");
    })

    
  }
  postMultipleEmployeeDetails() {
    console.log(this.multipleEmployees);
    this.multipleEmployees.pop();
    for(let val of this.multipleEmployees)
    {
      this.api.postEmployee(val)
      .subscribe(res=> {
        console.log(res);
        alert("Employee added successfully");
      },
      err=> {
        alert("Something went wrong");
        let ref = document.getElementById('cancel-multiple');
        ref?.click();
      })
    }
    this.multipleEmployees = [];
    this.multipleEmployees.push(new EmployeeModel());
    let ref = document.getElementById('cancel-multiple');
    ref?.click();
    this.formValue.reset;
    this.getAllEmployee();
  }

  getAllEmployee() {
    this.api.getEmployee()
    .subscribe(res=>{
      this.employeeData = res;
    })
  }

  deleteEmployee(row: any) {
    this.api.deleteEmployee(row.id)
    .subscribe(res=> {
      alert("Employee Deleted");
      this.getAllEmployee();
    })
  }

  onEdit(row : any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeModelObj.id = row.id;
    if (row.empImg==="")
    {
      this.showUploadField = true;
    }
    else
    {
      this.showUploadField = false;
      this.imgStringEditForm = row.empImg;

    }
    // console.log(this.showUploadField);
    // console.log(this.imgStringEditForm);
    // this.formValue.controls['empImg'].setValue(row.empImg);
    this.formValue.controls['empName'].setValue(row.empName);
    this.formValue.controls['email'].setValue(row.email);
    this.formValue.controls['mobile'].setValue(row.mobile);
    this.formValue.controls['salary'].setValue(row.salary);
  }

  updateEmployeeDetails() {
    this.employeeModelObj.empImg = this.imgString;
    this.employeeModelObj.empName = this.formValue.value.empName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;
    this.api.updateEmployee(this.employeeModelObj, this.employeeModelObj.id)
    .subscribe(res=> {
      alert("Updated Successfully");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee();
    })

  }
  addNewForm()  {
    // this.employeeModelObj = new EmployeeModel();
    // this.employeeModelObj.empName = this.formValue.value.empName;
    // this.employeeModelObj.email = this.formValue.value.email;
    // this.employeeModelObj.mobile = this.formValue.value.mobile;
    // this.employeeModelObj.salary = this.formValue.value.salary;
    // this.formValue.reset;
    this.employeeModelObj = new EmployeeModel();
    this.multipleEmployees.push({id: 0, empImg: '', empName: '', email: '', mobile : '', salary: ''});
    console.log(this.multipleEmployees);
    
  }
  onFileSelected(event : any) {
    // console.log(event.target.files[0]);
    this.chosenFile = event.target.files[0];
    let reader = new FileReader();
    var base64String= new String();
    reader.readAsDataURL(this.chosenFile);
  //   reader.onload = function () {
  //    base64String = (<string>reader.result).split(',')[1];
  //    callback(reader.result);
  //     // console.log(base64String);
  // }
      let me = this;
  reader.onloadend = (e) => {
    // console.log(reader.result);
    // console.log((<string>reader.result).split(',')[1]);
    // me.imgString = (<string>reader.result).split(',')[1];
    me.imgString = <String>reader.result;
    // console.log((<string>reader.result).split(',')[1]);
    // console.log(reader.result);
 };
  }

  showImageModal(row: any)
  {
    this.imgStringModal = row.empImg;
  }

  userDeleteImage() {
    this.showUploadField = true;
    this.imgStringEditForm = '';

  }
}

  
