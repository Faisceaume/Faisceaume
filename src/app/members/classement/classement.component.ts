import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Member } from 'src/app/members/member';
import { MemberService } from 'src/app/members/member.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.css']
})
export class ClassementComponent implements OnInit, OnDestroy {

  members: Member[];
  subscriptionMember: Subscription;

  constructor(private memberService: MemberService,
              private router: Router) { }

  ngOnInit() {
    this.memberService.getAllMembers();
    this.subscriptionMember = this.memberService.membersSubject.subscribe(data => {
      this.members = data;
    });
  }

  onRang() {
    const db = firebase.firestore();

    // la position du personnage dans le tableau
    let i = 1;

    this.members.forEach(
      (item) => {
        item.location = i;

        // mise à jour du personnage dans la collection racine
        db.collection('members').doc(item.memberid).update(item);

        // mise à jour du personnage dans la sous collection des catégories
        db.collection('categories')
                    .doc(item.categoryid).collection('members')
                    .doc(item.memberid).update(item);
        i++;
      }
    );

    this.router.navigate(['members']);
  }

  drop(event: CdkDragDrop<{memberid: string, categorieid: string, name: string, photo: string}[]>) {
    moveItemInArray(this.members, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy(): void {
    this.subscriptionMember.unsubscribe();
  }

}
