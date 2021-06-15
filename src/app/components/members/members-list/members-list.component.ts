import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { RoutingService } from 'src/app/services/routing/routing.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MembersService } from 'src/app/services/members/members.service';

import { ROLE_TYPES_EN } from 'src/app/models/role';
import { Member } from 'src/app/models/member';

import { MemberUserFormComponent } from '../forms/member-user-form/member-user-form.component';


@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit, OnDestroy {

  isGranted = false;
  rolesGranted = [ROLE_TYPES_EN.ADMIN];

  isDataLoaded = false;

  members: Member[] = [];
  membersObs: Observable<Member[]>
  membersSub: Subscription;

  constructor(
    private routingService: RoutingService,
    private dialogService: DialogService,
    private membersService: MembersService) { }

    
  ngOnInit(): void {
    this.membersService.isMembersSection = true;
    this.membersService.isMembersList = true;

    this.membersObs = this.membersService.getAllMembers();
    this.membersSub = this.membersObs.subscribe( members => {
      this.members = members;
      
      this.isDataLoaded = true;
    });

    /*
    this.route.params.subscribe (routeParams => {
      if (routeParams.libelleSearch && !this.membersService.isSearchByCategorie) {
        this.members = this.membersService.getMembersBySearchedLastname(this.route.snapshot.paramMap.get('libelleSearch'));
        this.conditionToDropped = false;
      } else if (routeParams.libelleSearch && this.membersService.isSearchByCategorie) {
        this.members = this.categoriesService.getCategoriePersonnages(this.route.snapshot.paramMap.get('libelleSearch'));
        this.conditionToDropped = false;
      } else {
        this.conditionToDropped = true;
        this.membersService.getAllMembers();
        this.membersSub = this.membersService.membersArraySub.subscribe(data => {
          this.members = data;
        });
      }
    });
    */
  }

  /*
  getSingleCategorie(member: Member): Categorie {
    return this.categories.find(cat => cat.id === member.categoryid);
  }
  */


  isAuthUserGranted(isGranted: boolean): void {
    this.isGranted = isGranted;
  }


  drop(event: CdkDragDrop<string[]>): void {
    // Useless to update the location if the user put the member on the same location
    if (event.previousIndex !== event.currentIndex) {
      // Dragged member
      this.membersService.updateLocation(event.previousIndex, event.currentIndex);
      // Other member switched
      this.membersService.updateLocation(event.currentIndex, event.previousIndex);
      moveItemInArray(this.members, event.previousIndex, event.currentIndex);
    }
  }
  

  onDetailsMember(member: Member): void {
    this.routingService.redirectMemberDetails(member);
  }

  onUpdateMemberUser(member: Member): void {
    this.membersService.setFormData(member);
    this.dialogService.openDialog(MemberUserFormComponent);
  }

  /*
  onEditMember(member: Member): void {

    //this.membersService.resetSingleUser();
    this.membersService.setFormData(member);
    this.membersService.setSessionMemberValue(member);
    if (member.picture) {
      this.membersService.beforePhotoUrl = member.picture;
      this.uploadImageService.fileUrl = member.picture;
    }
    this.membersService.beforeCategorieId = member.categoryid;
    this.router.navigate(['member-form']);
  }
  */

  /*
  onMemberDelete(member: Member) {
    if (confirm('Vraiment supprimer ?')) {
      if (member.picture) {
        this.membersService.deletePhoto(member.picture);
      }
      this.db.doc('members/' + member.memberid).delete();
      this.db.collection('categories')
                    .doc(member.categoryid).collection('members')
                    .doc(member.memberid).delete();
    }
  }
  */

  

  /*
  onRang() {
    //const db = firebase.firestore();
    // la position du personnage dans le tableau
    let i = 1;
    this.members.forEach(
      (item) => {
        item.location = i;

        // mise à jour du personnage dans la collection racine
        this.db.collection('members').doc(item.memberid).update(item);

        // mise à jour du personnage dans la sous collection des catégories
        this.db.collection('categories')
                    .doc(item.categoryid).collection('members')
                    .doc(item.memberid).update(item);
        i++;
      }
    );
  }
  */

  ngOnDestroy(): void {
    this.membersService.isMembersSection = false;
    this.membersService.isMembersList = false;

    this.membersSub.unsubscribe();
  }
}
