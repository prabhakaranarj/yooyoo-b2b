import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DialogEditEventArgs,
  EditService,
  EditSettingsModel,
  ExcelExportService,
  FilterService,
  FilterSettingsModel,
  GridComponent,
  PageService,
  PageSettingsModel,
  SaveEventArgs,
  SearchSettingsModel,
  SortService,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { apiUrl, thumbnailUrl } from '../../../core/api';
import { CurriculumService } from '../curriculum.service';
import { ToastService } from './../../../shared/services/toast.service';

@Component({
  selector: 'yoo-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [
    ToolbarService,
    ExcelExportService,
    SortService,
    PageService,
    FilterService,
    EditService
  ],
  encapsulation: ViewEncapsulation.None
})
export class QuizComponent implements OnInit {
  @ViewChild('quizForm') public quizForm: FormGroup;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('element') element;
  public mediaFormData: FormData = new FormData();
  requestType: string;
  thumbnailUrl = thumbnailUrl;
  editparams: { params: { popupHeight: string } };
  users: any;
  editSettings: EditSettingsModel;
  pageSettings: PageSettingsModel;
  initialSort: Object;
  searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel;
  line = 'Both';
  questions = [];
  toolbar: Array<string>;
  quizs = [];
  topics = [];
  quizData = {};
  isValid: Boolean = true;
  errorMsg: String = '';
  successMsg: String = '';
  apiUrl: string;
  enterPress: boolean;
  imgURL: any;
  constructor(
    private curriculumService: CurriculumService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {

    this.grid.allowKeyboard = false;
    this.apiUrl = apiUrl;
    this.pageSettings = { pageSize: 15 };
    this.toolbar = ['Add', 'Edit', 'Delete', 'Search'];
    this.searchSettings = {};
    this.filterOptions = { type: 'CheckBox' };
    this.editSettings = {
      allowEditing: true,
      allowDeleting: true,
      allowAdding: true,
      mode: 'Dialog'
    };
    this.editparams = { params: { popupHeight: '800px' } };
    this.initialSort = { columns: [{ field: '', direction: 'Ascending' }] };
    this.curriculumService.getAllTopics()
      .subscribe(res => {
        this.topics = res;
      });
    this.reload();
  }

  onToolbarClick(args: ClickEventArgs): void {
    if (args.item['properties'].text === 'Excel Export') {
      this.grid.excelExport();
    }
  }
  onClickAddQuestion(): any {
    this.questions.push({
      question: '',
      audio: '',
      answer: '',
      option1: '',
      option2: '',
      option3: '',
      thumbnail1: '',
      thumbnail2: '',
      thumbnail3: ''
    });
  }
  removeQuestion(index): any {
    this.questions.splice(index, 1);
  }
  // onFileChange(event, id, i): any {
  //   this.errorMsg = '';
  //   this.successMsg = '';
  //   this.isValid = true;
  //   const fileList: FileList = event.target.files;
  //   if (fileList.length > 0) {
  //     const file: File = fileList[0];
  //     if (
  //       file.type === 'image/gif' ||
  //       file.type === 'image/png' ||
  //       file.type === 'image/jpeg'
  //     ) {
  //       if (file.size > 500000) {
  //         this.isValid = false;
  //         this.errorMsg = 'Media file size should be >500kb.';
  //       } else {
  //         this.isValid = true;
  //       }
  //     } else if (file.type === 'audio/mp3' || file.type === 'audio/wav') {
  //       if (file.size > 2000000) {
  //         this.isValid = false;
  //         this.errorMsg = 'Media file size should be >2mb.';
  //       } else {
  //         this.isValid = true;
  //       }
  //     }
  //     if (this.isValid) {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(fileList[0]);
  //       reader.onload = _event => {
  //         this.quizData[`imageUrl${i}`] = reader.result;
  //       };
  //       this.mediaFormData.append('media', file, file.name);
  //       this.curriculumService
  //         .uploadMedia(id, this.mediaFormData)
  //         .subscribe(res => {
  //           this.successMsg = 'Uploaded successfully!';
  //           this.mediaFormData = new FormData();

  //         });
  //     }
  //   }
  // }
  actionBegin(args: SaveEventArgs): any {
    if (this.enterPress) {
      this.enterPress = false;
      args.cancel = true;
      return false;
    }
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.requestType = args.requestType;
      this.quizData = { ...args.rowData };
      this.questions = this.quizData['questions'];
      if (
        this.quizData['questions'] !== undefined &&
        this.quizData['questions'].length
      ) {
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
      } else {
        this.questions = [
          {
            question: '',
            audio: '',
            answer: '',
            option1: '',
            option2: '',
            option3: '',
            thumbnail1: '',
            thumbnail2: '',
            thumbnail3: ''
          }
        ];
      }
    } else if (args.requestType === 'delete') {
      if (confirm('Are you sure you want to delete ?')) {
        this.deleteQuiz(args.data[0].id);
      }
    }
    if (args.requestType === 'save') {
      this.questions.filter((item, index) => {
        item.question = this.quizData[`question${index}`];
        item.audio = this.quizData[`audio${index}`];
        item.option1 = this.quizData[`option0_${index}`];
        item.option2 = this.quizData[`option1_${index}`];
        item.option3 = this.quizData[`option2_${index}`];
        item.option1ImageLink = this.quizData[`option1ImageLink${index}`];
        item.option2ImageLink = this.quizData[`option2ImageLink${index}`];
        item.option3ImageLink = this.quizData[`option3ImageLink${index}`];
        const answer = this.quizData[`answer${index}`];
        item.answer = item[`option${answer}`];
      });
      const data = {
        topicId: this.quizData['topicId'],
        quizName: this.quizData['quizName'],
        questions: this.questions
      };
      if (this.requestType === 'add') {
        this.createQuizs(data);
      } else if (this.requestType === 'beginEdit') {
        data['id'] = args.data['id'];
        this.createQuizs(data);
      }
      this.errorMsg = '';
      this.successMsg = '';
      this.isValid = true;
      args.cancel = false;
    }
  }
  actionComplete(args: DialogEditEventArgs): void {
    this.errorMsg = '';
    this.successMsg = '';
    this.isValid = true;
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.dialog.width = '700px';
      args.dialog.buttons[0]['controlParent'].btnObj[0].element.setAttribute(
        'class',
        'hidden'
      );
      args.dialog.buttons[1]['controlParent'].btnObj[1].element.setAttribute(
        'class',
        'hidden'
      );
    }
  }
  preventDefault(): void {
    this.enterPress = true;
  }
  cancel(): void {
    this.grid.closeEdit();
  }
  onSubmit(): void {
   this.grid.endEdit();
  }

  createQuizs(formData): void {
    this.curriculumService.createQuiz(formData)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
        this.grid.refresh();
      });
  }
  deleteQuiz(id): void {
    this.curriculumService.deleteQuiz(id)
      .subscribe(res => {
        this.toast.success(res.message);
        this.reload();
      });
  }
  reload(): void {
    this.curriculumService.getAllQuizs()
      .subscribe(res => {
        this.quizs = res;
      });
  }
}
