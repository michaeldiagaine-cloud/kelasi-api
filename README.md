# API Documentation – Schools + Authentication

Cette documentation permet à l’équipe Frontend de comprendre :

* les endpoints disponibles
* les données à envoyer
* les réponses attendues
* l’utilisation des tokens JWT

## Base URL locale

```text
http://localhost:3000/api
```

## Base URL production (Render) Pour une supposition

```text
https://your-render-url.onrender.com/api
```

---

# 1. Authentication

Le système utilise :

* Access Token (JWT)
* Refresh Token
* Bearer Authentication

Après connexion :

```http
Authorization: Bearer your_access_token
```

---

## POST /auth/login

Connexion utilisateur.

### Body

```json
{
  "email": "admin@school.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "user": {
      "id": "uuid",
      "email": "admin@school.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "DIRECTION"
    }
  }
}
```

---

## POST /auth/refresh

Génère un nouveau access token.

### Body

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Token refreshed",
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

## POST /auth/logout

Déconnexion utilisateur.

### Body

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Logged out"
}
```

---

## GET /auth/me

Retourne l’utilisateur connecté.

### Headers

```http
Authorization: Bearer your_access_token
```

### Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "uuid",
    "email": "admin@school.com",
    "role": "DIRECTION",
    "school": {
      "id": "uuid",
      "name": "Complexe Scolaire Excellence",
      "code": "CSE001",
      "status": "ACTIVE"
    }
  }
}
```

---

## User Roles

Valeurs possibles :

```text
SUPER_ADMIN
DIRECTION
TEACHER
PARENT
STUDENT
```

---

# 2. Schools

Gestion des établissements scolaires.

---

## POST /schools

Créer une école.

### Body

```json
{
  "name": "Complexe Scolaire Excellence",
  "code": "CSE001"
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "name": "Complexe Scolaire Excellence",
    "code": "CSE001"
  }
}
```

---

## GET /schools

Liste de toutes les écoles.

### Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "name": "Complexe Scolaire Excellence",
      "code": "CSE001",
      "status": "ACTIVE",
      "created_at": "2026-04-27T10:00:00.000Z",
      "updated_at": "2026-04-27T10:00:00.000Z"
    }
  ]
}
```

---

## GET /schools/{id}

Récupérer une école par ID.

### Example

```text
GET /schools/uuid
```

### Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "uuid",
    "name": "Complexe Scolaire Excellence",
    "code": "CSE001",
    "status": "ACTIVE"
  }
}
```

---

## PUT /schools/{id}

Modifier une école.

### Body

```json
{
  "name": "Nouvelle école",
  "code": "NEW001"
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Updated",
  "data": {
    "id": "uuid",
    "name": "Nouvelle école",
    "code": "NEW001"
  }
}
```

---

## DELETE /schools/{id}

Supprimer une école.

### Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

---

# Standard API Response Format

Toutes les réponses utilisent ce format :

```json
{
  "status": "success | error",
  "message": "message",
  "data": {}
}
```

## 3. Classes

Gestion des classes scolaires rattachées à une école.

Chaque classe appartient à une école.

Exemples :

- 1ère A
- 2ème Commerciale
- Terminale Scientifique

---

# CLASS ENDPOINTS

---

## POST `/classes`

Créer une classe.

### Body

```json
{
  "name": "1ère A",
  "level": "Secondaire",
  "schoolId": "uuid-school"
}
```

## Success Response

```json
{
  "status": "error",
  "message": "Class already exists in this school"
}
```

## GET /classes

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "name": "1ère A",
      "level": "Secondaire",
      "schoolId": "uuid-school",
      "schoolName": "Complexe Scolaire Excellence",
      "schoolCode": "CSE001",
      "created_at": "2026-04-27T10:00:00.000Z",
      "updated_at": "2026-04-27T10:00:00.000Z"
    }
  ]
}
```

## GET /classes/{id}

Récupérer une classe par ID.

## Example

```text
GET /classes/uuid
```

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "uuid",
    "name": "1ère A",
    "level": "Secondaire",
    "schoolId": "uuid-school",
    "schoolName": "Complexe Scolaire Excellence",
    "schoolCode": "CSE001"
  }
}
```
## GET /classes/school/{schoolId}

Récupérer toutes les classes d’une école.

## Example

```text
GET /classes/school/uuid-school
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "name": "1ère A",
      "level": "Secondaire",
      "schoolId": "uuid-school"
    }
  ]
}
```
## PUT /classes/{id}

Mettre à jour une classe.

## body

```json
{
  "name": "2ème A",
  "level": "Humanités",
  "schoolId": "uuid-school"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Updated",
  "data": {
    "id": "uuid",
    "name": "2ème A",
    "level": "Humanités",
    "schoolId": "uuid-school"
  }
}
```
## DELETE /classes/{id}

Supprimer une classe.

## Example

```text
DELETE /classes/uuid
```

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

## 4. Students

Gestion des élèves.

Chaque étudiant est lié à un utilisateur (`users`) via `userId`.

Cela permet de séparer :

- les informations d’authentification (users)
- les informations métier de l’élève (students)

---

# STUDENT ENDPOINTS

---

## POST `/students`

Créer un élève.

### Body

```json
{
  "userId": "uuid-user",
  "studentCode": "STD-001"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "userId": "uuid-user",
    "studentCode": "STD-001"
  }
}
```

## GET /students

Récupérer tous les élèves.

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "studentCode": "STD-001",
      "userId": "uuid-user",
      "firstName": "Jean",
      "lastName": "Mukendi",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  ]
}
```

## GET /students/{id}

Récupérer un élève par ID.

## Example

```text
GET /students/uuid
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "uuid",
    "studentCode": "STD-001",
    "userId": "uuid-user",
    "firstName": "Jean",
    "lastName": "Mukendi",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

## PUT /students/{id}

Mettre à jour un élève.

## Body

```json
{
  "studentCode": "STD-002"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Updated",
  "data": {
    "id": "uuid",
    "studentCode": "STD-002"
  }
}
```

## DELETE /students/{id}

Supprimer un élève.

## Example

```text
DELETE /students/uuid
```

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 4 SCHOOL PRINCIPALS

Gestion des directeurs d’établissement.

Permet de :

- affecter un directeur à une école
- garantir qu’une seule direction active existe par école
- consulter les directeurs par école
- désactiver / clôturer un mandat

---

## POST `/school-principals`

Créer une affectation de directeur.

> Règle métier : une seule direction active par école.

### Body

```json
{
  "userId": "uuid-user",
  "schoolId": "uuid-school",
  "startDate": "2026-04-27",
  "isActive": true
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "userId": "uuid-user",
    "schoolId": "uuid-school",
    "startDate": "2026-04-27",
    "isActive": true
  }
}
```

## Error Response

Récupérer tous les directeurs.

```json
{
  "status": "error",
  "message": "This school already has an active principal"
}
```

## GET /school-principals

Récupérer tous les directeurs.

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid-user",
      "schoolId": "uuid-school",
      "startDate": "2026-04-27",
      "endDate": null,
      "isActive": true,
      "principalName": "Jean Mukendi",
      "schoolName": "Complexe Scolaire Excellence"
    }
  ]
}
```

## GET /school-principals/school/{schoolId}

Récupérer les directeurs d’une école.

## Example

```text
GET /school-principals/school/uuid-school
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid-user",
      "schoolId": "uuid-school",
      "startDate": "2026-04-27",
      "endDate": null,
      "isActive": true,
      "principalName": "Jean Mukendi"
    }
  ]
}
```

## PUT /school-principals/{id}

Mettre à jour un mandat de direction.

Utilisé principalement pour :

- désactiver un directeur
- ajouter une date de fin de mandat

## Body

```json
{
  "isActive": false,
  "endDate": "2026-12-31"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Updated",
  "data": null
}
```

## DELETE /school-principals/{id}

Supprimer une affectation.

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 5 PARENT STUDENTS

Gestion de la relation Parent ↔ Élève.

Permet de :

- lier un parent à un élève
- récupérer les enfants d’un parent
- récupérer les parents d’un élève
- gérer les accès parentaux aux devoirs, annonces, absences, discipline, etc.

Cette relation est essentielle pour le portail Parent.

---

## POST `/parent-students`

Créer une liaison Parent → Élève.

### Body

```json
{
  "parentId": "uuid-parent-user",
  "studentId": "uuid-student"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "parentId": "uuid-parent-user",
    "studentId": "uuid-student"
  }
}
```

## GET /parent-students

Récupérer toutes les relations Parent ↔ Élève.

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "parentId": "uuid-parent-user",
      "studentId": "uuid-student",
      "parentName": "Marie Ilunga",
      "studentCode": "STD-001",
      "studentName": "Jean Mukendi"
    }
  ]
}
```

## GET /parent-students/parent/{parentId}

Récupérer tous les enfants d’un parent.

## Example

```text
GET /parent-students/parent/uuid-parent-user
```
## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "parentId": "uuid-parent-user",
      "studentId": "uuid-student",
      "studentName": "Jean Mukendi"
    }
  ]
}
```

## GET /parent-students/student/{studentId}

Récupérer tous les parents d’un élève.

## Example

```text
GET /parent-students/student/uuid-student
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "parentId": "uuid-parent-user",
      "studentId": "uuid-student",
      "parentName": "Marie Ilunga"
    }
  ]
}
```

## DELETE /parent-students/{id}

Supprimer une relation Parent ↔ Élève.

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 6 TEACHER ASSIGNMENTS

Gestion des affectations des enseignants.

Permet de :

- affecter un enseignant à une classe
- définir la matière enseignée
- gérer l’année scolaire concernée
- récupérer les affectations par enseignant
- récupérer les affectations par classe

Cette relation permet de savoir :

- quel enseignant enseigne quelle matière
- dans quelle classe
- pour quelle année scolaire

---

## POST `/teacher-assignments`

Créer une affectation enseignant → classe.

### Body

```json
{
  "teacherId": "uuid-teacher-user",
  "classId": "uuid-class",
  "subject": "Mathématiques",
  "academicYear": "2025-2026"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "teacherId": "uuid-teacher-user",
    "classId": "uuid-class",
    "subject": "Mathématiques",
    "academicYear": "2025-2026"
  }
}
```

## GET /teacher-assignments

Récupérer toutes les affectations.

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "teacherId": "uuid-teacher-user",
      "classId": "uuid-class",
      "subject": "Mathématiques",
      "academicYear": "2025-2026",
      "teacherName": "Jean Mukendi",
      "className": "1ère A",
      "classLevel": "Secondaire",
      "schoolName": "Complexe Scolaire Excellence"
    }
  ]
}
```

## GET /teacher-assignments/teacher/{teacherId}

Récupérer les affectations d’un enseignant.

## Example

```text
GET /teacher-assignments/teacher/uuid-teacher-user
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "teacherId": "uuid-teacher-user",
      "classId": "uuid-class",
      "subject": "Mathématiques",
      "academicYear": "2025-2026",
      "className": "1ère A"
    }
  ]
}
```

## GET /teacher-assignments/class/{classId}

Récupérer les enseignants d’une classe.

## Example

```text
GET /teacher-assignments/class/uuid-class
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "teacherId": "uuid-teacher-user",
      "classId": "uuid-class",
      "subject": "Mathématiques",
      "academicYear": "2025-2026",
      "teacherName": "Jean Mukendi"
    }
  ]
}
```

## DELETE /teacher-assignments/{id}

Supprimer une affectation.

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 7 STUDENT CLASSES

Gestion de l’affectation Élève → Classe.

Permet de :

- affecter un élève à une classe
- gérer l’année scolaire
- définir la classe active actuelle
- récupérer les élèves par classe
- récupérer les élèves par école
- récupérer l’historique scolaire d’un élève

Cette relation est essentielle pour :

- les présences
- les devoirs
- les annonces
- la discipline
- le suivi scolaire global

Un élève ne peut avoir qu’une seule classe active à la fois. :contentReference[oaicite:0]{index=0}

---

## POST `/student-classes`

Créer une affectation Élève → Classe.

> Règle métier : un élève ne peut avoir qu’une seule classe active.

### Body

```json
{
  "studentId": "uuid-student",
  "classId": "uuid-class",
  "academicYear": "2025-2026",
  "isActive": true
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "studentId": "uuid-student",
    "classId": "uuid-class",
    "academicYear": "2025-2026",
    "isActive": true
  }
}
```
## Error Response

```json
{
  "status": "error",
  "message": "Student already has an active class"
}
```

## GET /student-classes

Récupérer toutes les affectations.

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "studentId": "uuid-student",
    "classId": "uuid-class",
    "academicYear": "2025-2026",
    "isActive": true
  }
}
```
## Error Response

```json
{
  "status": "error",
  "message": "Student already has an active class"
}
```

## GET /student-classes

Récupérer toutes les affectations.

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid-student",
      "classId": "uuid-class",
      "academicYear": "2025-2026",
      "isActive": true,
      "studentCode": "STD-001",
      "firstName": "Jean",
      "lastName": "Mukendi",
      "studentName": "Jean Mukendi",
      "className": "1ère A",
      "classLevel": "Secondaire",
      "schoolId": "uuid-school",
      "schoolName": "Complexe Scolaire Excellence"
    }
  ]
}
```
## GET /student-classes/{id}

Récupérer une affectation par ID.

## Example

```text
GET /student-classes/uuid
```
## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "uuid",
    "studentId": "uuid-student",
    "classId": "uuid-class",
    "academicYear": "2025-2026",
    "isActive": true
  }
}
```
## GET /student-classes/student/{studentId}

Récupérer l’historique scolaire d’un élève.

## Example

```text
GET /student-classes/student/uuid-student
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid-student",
      "classId": "uuid-class",
      "academicYear": "2025-2026",
      "isActive": true
    }
  ]
}
```
## GET /student-classes/class/{classId}

Récupérer les élèves d’une classe.

## Example

```text
GET /student-classes/class/uuid-class
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid-student",
      "classId": "uuid-class",
      "studentName": "Jean Mukendi",
      "className": "1ère A",
      "schoolName": "Complexe Scolaire Excellence"
    }
  ]
}
```
## GET /student-classes/school/{schoolId}

Récupérer tous les élèves d’une école.

## Example

```text
GET /student-classes/school/uuid-school
```
## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "studentId": "uuid-student",
      "classId": "uuid-class",
      "studentName": "Jean Mukendi",
      "className": "1ère A",
      "schoolName": "Complexe Scolaire Excellence"
    }
  ]
}
```
## PUT /student-classes/{id}

Mettre à jour une affectation.

## Body

```json
{
  "classId": "uuid-new-class",
  "academicYear": "2026-2027",
  "isActive": false
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Updated",
  "data": {
    "id": "uuid",
    "classId": "uuid-new-class",
    "academicYear": "2026-2027",
    "isActive": false
  }
}
```
## DELETE /student-classes/{id}

Supprimer une affectation.

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 8 ATTENDANCE

Gestion des présences scolaires.

Permet de :

- enregistrer la présence d’un élève
- gérer les absences et retards
- ajouter une note explicative
- suivre l’année scolaire
- savoir qui a marqué la présence
- lier automatiquement une justification d’absence

Cette entité est essentielle pour :

- le suivi journalier des élèves
- les notifications parentales
- les statistiques d’absences
- les justificatifs d’absence
- les rapports disciplinaires

---

## Valeurs possibles de `status`

```text
PRESENT
ABSENT
LATE
EXCUSED
```

## POST /attendance

Créer une présence.

- Règle métier : un élève ne peut pas avoir deux présences le même jour dans la même classe.

## Body

```json
{
  "date": "2026-04-27",
  "status": "ABSENT",
  "note": "Absence non justifiée",
  "studentId": "uuid-student",
  "classId": "uuid-class",
  "academicYear": "2025-2026",
  "markedBy": "uuid-user"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "date": "2026-04-27",
    "status": "ABSENT",
    "note": "Absence non justifiée",
    "studentId": "uuid-student",
    "classId": "uuid-class",
    "academicYear": "2025-2026",
    "markedBy": "uuid-user"
  }
}
```

## Error Response

```json
{
  "status": "error",
  "message": "Attendance already marked for this student"
}
```

GET /attendance

Récupérer toutes les présences.

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "date": "2026-04-27",
      "status": "ABSENT",
      "note": "Absence non justifiée",
      "studentId": "uuid-student",
      "classId": "uuid-class",
      "academicYear": "2025-2026",
      "markedBy": "uuid-user",

      "studentName": "Jean Mukendi",
      "className": "1ère A",
      "schoolName": "Complexe Scolaire Excellence",
      "markedByName": "Marie Ilunga",

      "justification": {
        "id": "uuid-justification",
        "reason": "Maladie",
        "documentUrl": "https://example.com/file.pdf",
        "status": "PENDING"
      }
    }
  ]
}
```

## GET /attendance/student/{studentId}

Récupérer les présences d’un élève.

## Query Params optionnels

```text
date=2026-04-27
academicYear=2025-2026
```

## Example

```text
GET /attendance/student/uuid-student?academicYear=2025-2026
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "status": "PRESENT",
      "date": "2026-04-27",
      "studentName": "Jean Mukendi",
      "className": "1ère A"
    }
  ]
}
```

## GET /attendance/class/{classId}

Récupérer les présences d’une classe.

## Example

```text
GET /attendance/school/uuid-school
```

## GET /attendance/date/{date}

Récupérer les présences d’une date.

## Example

```text
GET /attendance/date/2026-04-27
```

## GET /attendance/year/{academicYear}

Récupérer les présences d’une année scolaire.

## Example

```text
GET /attendance/year/2025-2026
```

## GET /attendance/filter

Recherche avancée multi-filtres.

## Query Params disponibles

```text
schoolId
classId
academicYear
date
```

## Example

```text
GET /attendance/filter?schoolId=uuid&classId=uuid&academicYear=2025-2026
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": []
}
```
## PUT /attendance/{id}

Mettre à jour une présence.

Principalement utilisé pour :

- modifier le statut
- ajouter une note
- corriger une erreur

## Body

```json
{
  "status": "EXCUSED",
  "note": "Absence justifiée par certificat médical"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Updated"
}
```

## DELETE /attendance/{id}

Supprimer une présence.

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 9 ANNOUNCEMENTS

Gestion des annonces scolaires.

Permet de :

- publier une annonce pour toute l’école
- publier une annonce pour une classe spécifique
- publier une annonce pour un élève précis
- épingler une annonce importante
- ajouter des pièces jointes
- suivre les lectures des annonces
- filtrer les annonces lues / non lues

Cette entité est essentielle pour :

- la communication école → parents
- la communication école → élèves
- les convocations
- les réunions de parents
- les rappels administratifs
- les urgences scolaires

---

## Types de ciblage

Une annonce peut être :

### 1. Générale (toute l’école)

```json id="fw86q8"
{
  "schoolId": "uuid-school",
  "classId": null,
  "studentId": null
}
```

### 2. Pour une classe

```json
{
  "schoolId": "uuid-school",
  "classId": "uuid-class",
  "studentId": null
}
```

### 3. Pour un élève précis

```json
{
  "schoolId": "uuid-school",
  "classId": null,
  "studentId": "uuid-student"
}
```
## POST /announcements

Créer une annonce.

## Body

```json
{
  "title": "Réunion parents",
  "content": "Une réunion est prévue demain à 10h.",
  "isPinned": true,
  "attachments": [
    "https://example.com/file.pdf"
  ],
  "schoolId": "uuid-school",
  "classId": null,
  "studentId": null,
  "createdBy": "uuid-user"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "title": "Réunion parents",
    "content": "Une réunion est prévue demain à 10h.",
    "isPinned": true,
    "attachments": [
      "https://example.com/file.pdf"
    ],
    "schoolId": "uuid-school",
    "classId": null,
    "studentId": null,
    "createdBy": "uuid-user"
  }
}
```

## GET /announcements

Récupérer toutes les annonces.

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "title": "Réunion parents",
      "content": "Une réunion est prévue demain à 10h.",
      "isPinned": true,
      "attachments": [
        "https://example.com/file.pdf"
      ],
      "schoolId": "uuid-school",
      "publishedAt": "2026-04-27T10:00:00.000Z",

      "authorName": "Aris Lema",
      "schoolName": "Complexe Scolaire Excellence",

      "_count": {
        "reads": 25
      }
    }
  ]
}
```

## GET /announcements/school/{schoolId}

Récupérer les annonces d’une école.

## Example

```text
GET /announcements/school/uuid-school
```

## GET /announcements/me

Récupérer mes annonces.

Fonctionne pour :

Parent
Élève

Le système filtre automatiquement :

annonces générales école
annonces de classe
annonces individuelles

## Headers

```http
Authorization: Bearer accessToken
```

## Query Param optionnel

```json
read=true
read=false
```

## Example

```text
GET /announcements/me?read=false
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "title": "Convocation",
      "content": "Merci de passer à l’école demain.",
      "isPinned": true,
      "attachments": [],
      "schoolName": "Complexe Scolaire Excellence",
      "authorName": "Direction",
      "isRead": false
    }
  ]
}
```

## POST /announcements/{id}/read

Marquer une annonce comme lue.

## Headers

```http
Authorization: Bearer accessToken
```

## Success Response

```json
{
  "status": "success",
  "message": "Marked as read"
}
```

## DELETE /announcements/{id}

Supprimer une annonce.

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 10 HOMEWORKS

Gestion des devoirs scolaires.

Permet de :

- créer un devoir pour une classe
- définir la matière concernée
- fixer une date limite de remise
- ajouter des pièces jointes
- filtrer les devoirs par école / classe / année scolaire / date
- permettre aux élèves de voir leurs devoirs
- permettre aux parents de voir les devoirs de leurs enfants

Cette entité est essentielle pour :

- le suivi pédagogique
- l’organisation des remises
- la communication enseignant → élève
- le suivi parental
- la préparation académique

Le système filtre automatiquement les devoirs visibles pour :

- STUDENT
- PARENT :contentReference[oaicite:0]{index=0}

---

## POST `/homeworks`

Créer un devoir.

### Body

```json
{
  "title": "Maths - Exercices",
  "description": "Faire les exercices 1 à 5",
  "subject": "Mathématiques",
  "dueDate": "2026-04-20",
  "attachments": [
    "https://example.com/file.pdf"
  ],
  "classId": "uuid-class",
  "teacherId": "uuid-teacher",
  "academicYear": "2025-2026"
}
```

### Règles métier
teacherId doit exister
l’utilisateur doit avoir le rôle TEACHER

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "title": "Maths - Exercices",
    "description": "Faire les exercices 1 à 5",
    "subject": "Mathématiques",
    "dueDate": "2026-04-20",
    "attachments": [
      "https://example.com/file.pdf"
    ],
    "classId": "uuid-class",
    "teacherId": "uuid-teacher",
    "academicYear": "2025-2026"
  }
}
```

## Error Response

```json
{
  "status": "error",
  "message": "Teacher not found"
}
```

- ou

```json
{
  "status": "error",
  "message": "User is not a teacher"
}
```

## GET /homeworks

Récupérer tous les devoirs.

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "title": "Maths - Exercices",
      "description": "Faire les exercices 1 à 5",
      "subject": "Mathématiques",
      "dueDate": "2026-04-20",
      "attachments": [
        "https://example.com/file.pdf"
      ],
      "classId": "uuid-class",
      "teacherId": "uuid-teacher",
      "academicYear": "2025-2026"
    }
  ]
}
```

## GET /homeworks/me

Récupérer mes devoirs.

Fonctionne pour :

STUDENT
PARENT

Le système récupère automatiquement :

Pour STUDENT
sa classe active
Pour PARENT
les enfants liés
leurs classes actives

Puis retourne uniquement les devoirs concernés.

## Headers

```http
Authorization: Bearer accessToken
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "title": "Maths - Exercices",
      "subject": "Mathématiques",
      "dueDate": "2026-04-20",
      "className": "1ère A",
      "teacherName": "Jean Mukendi"
    }
  ]
}
```

## GET /homeworks/filter

Recherche avancée multi-filtres.

## Query Params disponibles

```json
schoolId
classId
academicYear
date
```

## Example

```text
GET /homeworks/filter?schoolId=uuid&classId=uuid&academicYear=2025-2026
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "title": "Maths - Exercices",
      "subject": "Mathématiques",
      "dueDate": "2026-04-20",
      "className": "1ère A",
      "schoolName": "Complexe Scolaire Excellence",
      "teacherName": "Jean Mukendi"
    }
  ]
}
```

## PUT /homeworks/{id}

Mettre à jour un devoir.

Principalement utilisé pour :

modifier le titre
corriger la description
changer la date limite
modifier les pièces jointes

## Body

```json
{
  "title": "Nouveau titre",
  "description": "Nouvelle description"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Updated"
}
```

## DELETE /homeworks/{id}

Supprimer un devoir.

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 11 DISCIPLINE REPORTS

Gestion des rapports disciplinaires.

Permet de :

- enregistrer un incident disciplinaire
- définir le niveau de gravité
- préciser l’action prise
- lier l’incident à un élève
- identifier le responsable de la décision (direction)
- filtrer les rapports par école / classe / élève / date / niveau

Cette entité est essentielle pour :

- le suivi comportemental
- les sanctions disciplinaires
- les convocations des parents
- l’historique disciplinaire
- les décisions administratives

Seule la DIRECTION peut créer un rapport disciplinaire. 

---

## Valeurs possibles de `level`

```text
WARNING
SUSPENSION
EXCLUSION
OTHER
```

## POST /discipline

Créer un rapport disciplinaire.

## Headers

```http
Authorization: Bearer accessToken
```

## Règle métier

Seul un utilisateur avec le rôle : DIRECTION

## peut créer un rapport disciplinaire.

Le principalId est automatiquement récupéré depuis le token JWT.

## Body

```json
{
  "title": "Bagarre",
  "description": "Conflit entre élèves dans la cour",
  "level": "SUSPENSION",
  "actionTaken": "3 jours de suspension",
  "date": "2026-04-10",
  "studentId": "uuid-student",
  "academicYear": "2025-2026"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "title": "Bagarre",
    "description": "Conflit entre élèves dans la cour",
    "level": "SUSPENSION",
    "actionTaken": "3 jours de suspension",
    "date": "2026-04-10",
    "studentId": "uuid-student",
    "principalId": "uuid-direction",
    "academicYear": "2025-2026"
  }
}
```

## Error Response

```json
{
  "status": "error",
  "message": "Only direction can create discipline reports"
}
```

## GET /discipline

Récupérer les rapports disciplinaires avec filtres.

## Query Params disponibles

```json
schoolId
classId
studentId
level
academicYear
date
```

## Example

```text
GET /discipline?schoolId=uuid&classId=uuid&level=SUSPENSION
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "title": "Bagarre",
      "description": "Conflit entre élèves dans la cour",
      "level": "SUSPENSION",
      "actionTaken": "3 jours de suspension",
      "date": "2026-04-10",
      "studentId": "uuid-student",
      "principalId": "uuid-direction",
      "academicYear": "2025-2026",

      "studentName": "Jean Mukendi",
      "principalName": "Marie Ilunga",
      "className": "1ère A",
      "schoolName": "Complexe Scolaire Excellence"
    }
  ]
}
```

## DELETE /discipline/{id}

Supprimer un rapport disciplinaire.

## Example

```text
DELETE /discipline/uuid
```

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 12 ABSENCE JUSTIFICATIONS

Gestion des justificatifs d’absence.

Permet de :

- soumettre un justificatif pour une absence
- joindre un document justificatif
- lier la justification à une présence marquée ABSENT ou LATE
- éviter les doublons de justification
- permettre la validation ou le rejet par l’administration
- tracer la personne ayant validé ou refusé

Cette entité est essentielle pour :

- la gestion des absences
- le suivi administratif
- la validation parentale
- les retards justifiés
- la conformité scolaire

Une justification n’est autorisée que pour :

```text
ABSENT
LATE
```

et une seule justification est autorisée par présence.

Valeurs possibles de status

```text
PENDING
APPROVED
REJECTED
```

## POST /justifications

Créer un justificatif.

## Body

```json
{
  "reason": "Maladie",
  "documentUrl": "https://example.com/certificat.pdf",
  "attendanceId": "uuid-attendance"
}
```

## Règles métier

l’attendance doit exister
le statut de présence doit être :
ABSENT
LATE

une seule justification par présence

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "reason": "Maladie",
    "documentUrl": "https://example.com/certificat.pdf",
    "attendanceId": "uuid-attendance",
    "status": "PENDING"
  }
}
```

## Error Response

```json
{
  "status": "error",
  "message": "Attendance not found"
}
```

- ou

```json
{
  "status": "error",
  "message": "Justification only allowed for ABSENT or LATE"
}
```

- ou

```json
{
  "status": "error",
  "message": "Justification already exists"
}
```

## GET /justifications/attendance/{attendanceId}

Récupérer le justificatif d’une présence.

## Example


```text
GET /justifications/attendance/uuid-attendance
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "uuid",
    "reason": "Maladie",
    "documentUrl": "https://example.com/certificat.pdf",
    "status": "PENDING",
    "attendanceId": "uuid-attendance",
    "reviewedBy": "uuid-user",
    "reviewedByName": "Marie Ilunga"
  }
}
```

## PUT /justifications/{id}/review

Valider ou rejeter un justificatif.

Utilisé par :

direction
administration
personnel autorisé

## Body

```json
{
  "status": "APPROVED",
  "reviewedBy": "uuid-user"
}
```

## Valeurs possibles

```text
APPROVED
REJECTED
```

## Success Response

```text
{
  "status": "success",
  "message": "Reviewed"
}
```

## DELETE /justifications/{id}

Supprimer un justificatif.

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

# 13 USERS

Gestion des utilisateurs de la plateforme.

Permet de :

- créer un utilisateur
- gérer les rôles système
- rattacher un utilisateur à une école
- récupérer les utilisateurs par école
- modifier les informations utilisateur
- supprimer un utilisateur

Cette entité est essentielle pour :

- l’authentification
- les permissions
- la gestion des accès
- la hiérarchie scolaire
- l’administration globale de la plateforme

---

## Rôles disponibles

```text
SUPER_ADMIN
DIRECTION
TEACHER
PARENT
STUDENT
STAFF
```

## Règle métier importante

Tous les utilisateurs doivent appartenir à une école sauf :

```json
SUPER_ADMIN
```

Si le rôle n’est pas SUPER_ADMIN, alors schoolId est obligatoire.

## POST /users

Créer un utilisateur.

## Body

```json
{
  "email": "teacher@school.com",
  "password": "Password123",
  "firstName": "Jean",
  "lastName": "Mukendi",
  "role": "TEACHER",
  "schoolId": "uuid-school"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Created",
  "data": {
    "id": "uuid",
    "email": "teacher@school.com",
    "firstName": "Jean",
    "lastName": "Mukendi",
    "role": "TEACHER",
    "schoolId": "uuid-school"
  }
}
```

## Error Response

```json
{
  "status": "error",
  "message": "School is required"
}
```


## GET /users

Récupérer tous les utilisateurs.

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "email": "teacher@school.com",
      "firstName": "Jean",
      "lastName": "Mukendi",
      "role": "TEACHER",
      "schoolId": "uuid-school",
      "schoolName": "Complexe Scolaire Excellence",
      "schoolCode": "CSE001"
    }
  ]
}
```

## GET /users/{id}

Récupérer un utilisateur par ID.

## Example

```text
GET /users/uuid-user
```
## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "uuid",
    "email": "teacher@school.com",
    "firstName": "Jean",
    "lastName": "Mukendi",
    "role": "TEACHER",
    "schoolId": "uuid-school",
    "schoolName": "Complexe Scolaire Excellence",
    "schoolCode": "CSE001"
  }
}
```

## GET /users/{id}

Récupérer un utilisateur par ID.

## Example

```text
GET /users/uuid-user
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "uuid",
    "email": "teacher@school.com",
    "firstName": "Jean",
    "lastName": "Mukendi",
    "role": "TEACHER",
    "schoolId": "uuid-school",
    "schoolName": "Complexe Scolaire Excellence",
    "schoolCode": "CSE001"
  }
}
```

## GET /users/school/{schoolId}

Récupérer les utilisateurs d’une école.

## Example

```text
GET /users/school/uuid-school
```

## Success Response

```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "email": "teacher@school.com",
      "firstName": "Jean",
      "lastName": "Mukendi",
      "role": "TEACHER",
      "schoolId": "uuid-school",
      "schoolName": "Complexe Scolaire Excellence",
      "schoolCode": "CSE001"
    }
  ]
}
```

## PUT /users/{id}

Mettre à jour un utilisateur.

## Champs modifiables

```json
email
firstName
lastName
role
schoolId
```

## Body

```json
{
  "firstName": "Marie",
  "lastName": "Ilunga",
  "role": "DIRECTION"
}
```

## Success Response

```json
{
  "status": "success",
  "message": "Updated",
  "data": {
    "id": "uuid",
    "email": "teacher@school.com",
    "firstName": "Marie",
    "lastName": "Ilunga",
    "role": "DIRECTION",
    "schoolId": "uuid-school"
  }
}
```

## DELETE /users/{id}

Supprimer un utilisateur.

## Example

```text
DELETE /users/uuid-user
```

## Success Response

```json
{
  "status": "success",
  "message": "Deleted"
}
```

---



# Important Notes for Frontend Team

## Toujours stocker

* accessToken
* refreshToken

## En cas de 401 Unauthorized

Appeler :

```text
POST /auth/refresh
```

puis relancer la requête initiale.

## Toujours envoyer

```http
Authorization: Bearer accessToken
```

pour les route
