import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { apiUrl, thumbnailUrl } from '../../../core/api';

import { CurriculumService } from '../curriculum.service';

@Component({
  selector: 'yoo-quiz-view',
  templateUrl: './quiz-view.component.html',
  styleUrls: ['./quiz-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QuizViewComponent implements OnInit {
  @ViewChild('quizForm') public quizForm: FormGroup;
  @ViewChild('element') element;
  @Input() selectedTopic = [];
  thumbnailUrl = thumbnailUrl;

  quizs: any;
  questions: any;
  quizData: any;
  load = false;
  constructor(
    private curriculumService: CurriculumService
  ) { }

  ngOnInit(): void {
    this.reload();
  }
  reload(): void {
    this.curriculumService.getOneQuizs(this.selectedTopic[0])
      .subscribe(res => {
        this.load = true;
        this.quizData = res[0];
        if (
          this.quizData !== undefined &&
          this.quizData['questions'].length
          ) {
          this.questions = this.quizData['questions'];
          this.quizData['questions'].filter((item, index) => {
            this.quizData[`imageUrl${index}`] = `${apiUrl}/media/getMedia/${item.id}`;
            this.quizData[`questionId${index}`] = item.id;
            this.quizData[`question${index}`] = item.question;
            this.quizData[`audio${index}`] = item.audio;
            this.quizData[`option0_${index}`] = item.option1;
            this.quizData[`option1_${index}`] = item.option2;
            this.quizData[`option2_${index}`] = item.option3;
            this.quizData[`option1ImageLink${index}`] = item.option1ImageLink;
            this.quizData[`option2ImageLink${index}`] = item.option2ImageLink;
            this.quizData[`option3ImageLink${index}`] = item.option3ImageLink;
            this.quizData[`answer${index}`] = item.answer === item.option1 ? '1' : (item.answer === item.option2 ? '2' : '3');
          });
        }
      });
   }
}
