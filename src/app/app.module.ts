import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './workspace/Chat/chat/chat.component';
import { environment } from 'src/environments/environment';
import { ContactComponent } from './contact/contact.component';
import { ReceivedMessageComponent } from './workspace/Chat/received-message/received-message.component';
import { SentMessageComponent } from './workspace/Chat/sent-message/sent-message.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from './content/content.component';
import { AboutComponent } from './about/about.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FeatureComponent } from './feature/feature.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ProfileComponent } from './profile/profile.component';

import { PaintComponent } from './workspace/paint/paint.component';
import { PaintService } from './workspace/paint.service';
import { CreateProjectComponent } from './create-project/create-project.component';
import { TodoComponent } from './workspace/todo/todo.component';
import { TodoListComponent } from './workspace/todo-list/todo-list.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { AboutmeComponent } from './profile/aboutme/aboutme.component';
import { ProjectsListComponent } from './profile/projects-list/projects-list.component';
import { MembersComponent } from './workspace/members/members.component';
import { RequestsListComponent } from './profile/requests-list/requests-list.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ContactComponent,
    ReceivedMessageComponent,
    SentMessageComponent,
    NavbarComponent,
    ContentComponent,
    AboutComponent,
    ContactusComponent,
    FeatureComponent,
    HomeComponent,
    RegistrationComponent,
    LoginComponent,
    LogoutComponent,
    ProfileComponent,
    PaintComponent,
    CreateProjectComponent,
    TodoComponent,
    TodoListComponent,
    WorkspaceComponent,
    AboutmeComponent,
    ProjectsListComponent,
    MembersComponent,
    RequestsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule , 

  ],
  providers: [PaintService],
  bootstrap: [AppComponent]
})
export class AppModule { }
