import { Component, OnInit, OnDestroy } from '@angular/core';
import { Member } from './member';
import { MemberService } from './member.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Categorie } from './categories/categorie';
import { CategoriesService } from './categories/categories.service';
import { Router, ActivatedRoute } from '@angular/router';
/*import * as firebase from 'firebase/app';
import 'firebase/storage';*/
import { UsersService } from '../authentification/users.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit, OnDestroy {

  members: Member[];
  member: Member[];
  categories: Categorie[] = [];

  conditionToDropped: boolean;
  dropped: boolean;
  subscriptionMember: Subscription;
  subscriptionCategorie: Subscription;

  constructor(private memberService: MemberService,
              private db: AngularFirestore,
              private categorieService: CategoriesService,
              private router: Router,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              public usersService: UsersService) { }

  ngOnInit() {
    this.memberService.resetForm();

    this.categorieService.getAllCategories();
    this.categorieService.categoriesSubject.subscribe(data => {
      this.categories = data;
    });

    this.route.params.subscribe (routeParams => {
      if (routeParams.libelleSearch && !this.memberService.isSearchByCategorie) {
        this.members = this.memberService.getMembersBySearchName(this.route.snapshot.paramMap.get('libelleSearch'));
        this.conditionToDropped = false;
      } else if (routeParams.libelleSearch && this.memberService.isSearchByCategorie) {
        this.members = this.categorieService.getCategoriePersonnages(this.route.snapshot.paramMap.get('libelleSearch'));
        this.conditionToDropped = false;
      } else {
        this.conditionToDropped = true;
        this.memberService.getAllMembers();
        this.memberService.membersSubject.subscribe(data => {
          this.members = data;
        });
      }
    });
  }
  getSingleCategorie(member: Member): Categorie {
    return this.categories.find(cat => cat.id === member.categoryid);
  }


  onEdit(member: Member) {
    this.memberService.resetSingleUser();
    this.memberService.setFormDataValue(member);
    this.memberService.setSessionMemberValue(member);
    if (member.picture) {
      this.memberService.beforePhotoUrl = member.picture;
      this.memberService.fileUrl = member.picture;
    }
    this.memberService.beforeCategorieId = member.categoryid;
    this.router.navigate(['edit']);
  }

  onDelete(member: Member) {
    if (confirm('Vraiment supprimer ?')) {
      if (member.picture) {
        this.memberService.deletePhoto(member.picture);
      }
      this.db.doc('members/' + member.memberid).delete();
      this.db.collection('categories')
                    .doc(member.categoryid).collection('members')
                    .doc(member.memberid).delete();
    }
  }

  getBackground(image) {
    return image ? this.sanitizer.bypassSecurityTrustStyle(`url('${image}')`) : null;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.members, event.previousIndex, event.currentIndex);
    this.onRang();
  }

  onRang() {
    /*const db = firebase.firestore();*/
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

  ngOnDestroy(): void {
    this.subscriptionMember.unsubscribe();
    this.subscriptionCategorie.unsubscribe();
  }

}
