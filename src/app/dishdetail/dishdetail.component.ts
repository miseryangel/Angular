import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared//dish';
import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Comment } from '../shared/comment';
import  { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  commentForm!: FormGroup;
  userComment!: Comment;
  dish!: Dish;
  dishIds!: string[];
  prev!: string;
  next!: string;
  sliderValue:number = 5;

  @ViewChild('fform') commentFormDirective!:NgForm;

  formErrors:any = {
    'author':'',
    'rating':5,
    'comment':'',
    'date':'',
  };

  validationMessages:any = {
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
    },
    'comment': {
      'required':      'Comment is required.',
    },
  };

  onValueChange(data?: any){
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    console.log(form.valid);
    this.userComment = this.commentForm.value;
    this.userComment.rating = this.sliderValue;
    console.log(this.userComment);
    for (const field in this.formErrors){
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for (const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  
  constructor(private dishService: DishService, 
              private route: ActivatedRoute,
              private location: Location,private fb: FormBuilder) { 
                this.createForm();
              }

  ngOnInit(): void {
    this.dishService.getDishIds()
      .subscribe((dishIds) => {this.dishIds = dishIds;});
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe((dish) => { this.dish = dish; this.setPrevNext(dish.id); });
  }

  setPrevNext(dishId: string): void {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      author: ['', [Validators.required,Validators.minLength(2)]],
      rating: '',
      comment: ['', Validators.required],
      date: '',
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChange(data));
    this.onValueChange();   // reset messages
  }

  onSubmit() {
    this.userComment = this.commentForm.value;
    console.log(this.userComment);
    const date = new Date();
    this.userComment.date = date.toISOString();
    this.dish.comments.push(this.userComment);
    this.commentForm.reset({
      author:'',
      rating:'5',
      comment:'',
      date:'',
    });
    this.sliderValue = 5;
    this.commentFormDirective.resetForm();
  }

  onSliderChange(event:MatSliderChange){
    console.log(event.value);
    if (event.value != null) this.sliderValue = event.value;
    this.onValueChange();
  }

}
