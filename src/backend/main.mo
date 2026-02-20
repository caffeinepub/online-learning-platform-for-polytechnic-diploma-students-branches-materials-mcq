import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Branch = {
    id : Nat;
    name : Text;
  };

  type Semester = {
    id : Nat;
    branchId : Nat;
    number : Nat;
  };

  type Subject = {
    id : Nat;
    branchId : Nat;
    semesterId : Nat;
    name : Text;
  };

  type Notes = {
    id : Nat;
    subjectId : Nat;
    title : Text;
    year : Nat;
    tags : [Text];
    file : Storage.ExternalBlob;
  };

  type QuestionPaper = {
    id : Nat;
    subjectId : Nat;
    year : Nat;
    examType : ?Text;
    file : Storage.ExternalBlob;
  };

  type MCQ = {
    id : Nat;
    subjectId : Nat;
    question : Text;
    options : [Text];
    correctAnswer : Nat;
    explanation : ?Text;
  };

  type Syllabus = {
    subjectId : Nat;
    overview : Text;
  };

  type UserProfile = {
    name : Text;
    email : ?Text;
  };

  type SearchResult = {
    subjects : [Subject];
    notes : [Notes];
    questionPapers : [QuestionPaper];
    mcqs : [MCQ];
  };

  type MCQAnswer = {
    mcqId : Nat;
    selectedAnswer : Nat;
  };

  type MCQPracticeResult = {
    totalQuestions : Nat;
    correctAnswers : Nat;
    score : Float;
  };

  module MCQ {
    public func compareBySubjectId(mcq1 : MCQ, mcq2 : MCQ) : Order.Order {
      Nat.compare(mcq1.subjectId, mcq2.subjectId);
    };
  };

  let branches = Map.empty<Nat, Branch>();
  let semesters = Map.empty<Nat, Semester>();
  let subjects = Map.empty<Nat, Subject>();
  let notes = Map.empty<Nat, Notes>();
  let questionPapers = Map.empty<Nat, QuestionPaper>();
  let mcqs = Map.empty<Nat, MCQ>();
  let syllabuses = Map.empty<Nat, Syllabus>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization Setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var nextId = 1;

  // Helper functions for text search
  func toLowerCase(text : Text) : Text {
    text.map(
      func(c) {
        let code = c.toNat32();
        if (code >= 65 and code <= 90) {
          // Uppercase A-Z
          Char.fromNat32(code + 32);
        } else {
          c;
        };
      }
    );
  };

  func containsIgnoreCase(text : Text, pattern : Text) : Bool {
    let lowerText = toLowerCase(text);
    let lowerPattern = toLowerCase(pattern);

    let inputChars = lowerText.chars().toArray();
    let patternChars = lowerPattern.chars().toArray();

    let inputSize = inputChars.size();
    let patternSize = patternChars.size();

    if (patternSize == 0 or patternSize > inputSize) {
      return false;
    };

    for (i in Nat.range(0, inputSize - patternSize + 1)) {
      var match = true;
      for (j in Nat.range(0, patternSize)) {
        if (inputChars[i + j] != patternChars[j]) {
          match := false;
        };
      };
      if (match) { return true };
    };
    false;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Branches - Admin only for add/update/delete, public for read
  public shared ({ caller }) func addBranch(name : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextId;
    nextId += 1;
    let branch = { id; name };
    branches.add(id, branch);
    id;
  };

  public shared ({ caller }) func updateBranch(id : Nat, name : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (branches.get(id)) {
      case (?_) {
        let branch = { id; name };
        branches.add(id, branch);
      };
      case null {
        Runtime.trap("Branch not found");
      };
    };
  };

  public shared ({ caller }) func deleteBranch(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    branches.remove(id);
  };

  public query func getBranches() : async [Branch] {
    branches.values().toArray();
  };

  public query func getBranch(id : Nat) : async ?Branch {
    branches.get(id);
  };

  // Semesters - Admin only for add/update/delete, public for read
  public shared ({ caller }) func addSemester(branchId : Nat, number : Nat) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextId;
    nextId += 1;
    let semester = { id; branchId; number };
    semesters.add(id, semester);
    id;
  };

  public shared ({ caller }) func updateSemester(id : Nat, branchId : Nat, number : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (semesters.get(id)) {
      case (?_) {
        let semester = { id; branchId; number };
        semesters.add(id, semester);
      };
      case null {
        Runtime.trap("Semester not found");
      };
    };
  };

  public shared ({ caller }) func deleteSemester(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    semesters.remove(id);
  };

  public query func getSemesters() : async [Semester] {
    semesters.values().toArray();
  };

  public query func getSemestersByBranch(branchId : Nat) : async [Semester] {
    semesters.values().toArray().filter(func(sem) { sem.branchId == branchId });
  };

  // Subjects - Admin only for add/update/delete, public for read
  public shared ({ caller }) func addSubject(branchId : Nat, semesterId : Nat, name : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextId;
    nextId += 1;
    let subject = { id; branchId; semesterId; name };
    subjects.add(id, subject);
    id;
  };

  public shared ({ caller }) func updateSubject(id : Nat, branchId : Nat, semesterId : Nat, name : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (subjects.get(id)) {
      case (?_) {
        let subject = { id; branchId; semesterId; name };
        subjects.add(id, subject);
      };
      case null {
        Runtime.trap("Subject not found");
      };
    };
  };

  public shared ({ caller }) func deleteSubject(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    subjects.remove(id);
  };

  public query func getSubjects() : async [Subject] {
    subjects.values().toArray();
  };

  public query func getSubjectsBySemester(semesterId : Nat) : async [Subject] {
    subjects.values().toArray().filter(func(subj) { subj.semesterId == semesterId });
  };

  public query func getSubject(id : Nat) : async ?Subject {
    subjects.get(id);
  };

  // Notes - Admin only for add/update/delete, public for read
  public shared ({ caller }) func addNotes(subjectId : Nat, title : Text, year : Nat, tags : [Text], file : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextId;
    nextId += 1;
    let note = {
      id;
      subjectId;
      title;
      year;
      tags;
      file;
    };
    notes.add(id, note);
    id;
  };

  public shared ({ caller }) func updateNotes(id : Nat, subjectId : Nat, title : Text, year : Nat, tags : [Text], file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (notes.get(id)) {
      case (?_) {
        let note = {
          id;
          subjectId;
          title;
          year;
          tags;
          file;
        };
        notes.add(id, note);
      };
      case null {
        Runtime.trap("Notes not found");
      };
    };
  };

  public shared ({ caller }) func deleteNotes(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    notes.remove(id);
  };

  public query func getNotesBySubject(subjectId : Nat) : async [Notes] {
    notes.values().toArray().filter(func(note) { note.subjectId == subjectId });
  };

  public query func getNotesById(id : Nat) : async ?Notes {
    notes.get(id);
  };

  // Question Papers - Admin only for add/update/delete, public for read
  public shared ({ caller }) func addQuestionPaper(subjectId : Nat, year : Nat, examType : ?Text, file : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextId;
    nextId += 1;
    let paper = {
      id;
      subjectId;
      year;
      examType;
      file;
    };
    questionPapers.add(id, paper);
    id;
  };

  public shared ({ caller }) func updateQuestionPaper(id : Nat, subjectId : Nat, year : Nat, examType : ?Text, file : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (questionPapers.get(id)) {
      case (?_) {
        let paper = {
          id;
          subjectId;
          year;
          examType;
          file;
        };
        questionPapers.add(id, paper);
      };
      case null {
        Runtime.trap("Question paper not found");
      };
    };
  };

  public shared ({ caller }) func deleteQuestionPaper(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    questionPapers.remove(id);
  };

  public query func getQuestionPapersBySubject(subjectId : Nat) : async [QuestionPaper] {
    questionPapers.values().toArray().filter(func(paper) { paper.subjectId == subjectId });
  };

  public query func getQuestionPaperById(id : Nat) : async ?QuestionPaper {
    questionPapers.get(id);
  };

  // MCQs - Admin only for add/update/delete, public for read
  public shared ({ caller }) func addMCQ(subjectId : Nat, question : Text, options : [Text], correctAnswer : Nat, explanation : ?Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextId;
    nextId += 1;
    let mcq = {
      id;
      subjectId;
      question;
      options;
      correctAnswer;
      explanation;
    };
    mcqs.add(id, mcq);
    id;
  };

  public shared ({ caller }) func updateMCQ(id : Nat, subjectId : Nat, question : Text, options : [Text], correctAnswer : Nat, explanation : ?Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (mcqs.get(id)) {
      case (?_) {
        let mcq = {
          id;
          subjectId;
          question;
          options;
          correctAnswer;
          explanation;
        };
        mcqs.add(id, mcq);
      };
      case null {
        Runtime.trap("MCQ not found");
      };
    };
  };

  public shared ({ caller }) func deleteMCQ(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    mcqs.remove(id);
  };

  public query func getMCQsBySubject(subjectId : Nat) : async [MCQ] {
    mcqs.values().toArray().filter(func(mcq) { mcq.subjectId == subjectId });
  };

  public query func getMCQById(id : Nat) : async ?MCQ {
    mcqs.get(id);
  };

  // MCQ Practice - Users can practice, guests can view
  public query func evaluateMCQAnswers(answers : [MCQAnswer]) : async MCQPracticeResult {
    var correctCount = 0;
    let totalQuestions = answers.size();

    for (answer in answers.vals()) {
      switch (mcqs.get(answer.mcqId)) {
        case (?mcq) {
          if (mcq.correctAnswer == answer.selectedAnswer) {
            correctCount += 1;
          };
        };
        case null {};
      };
    };

    let score = if (totalQuestions > 0) {
      correctCount.toFloat() / totalQuestions.toFloat() * 100.0;
    } else {
      0.0;
    };

    {
      totalQuestions;
      correctAnswers = correctCount;
      score;
    };
  };

  // Syllabus - Admin only for add/update/delete, public for read
  public shared ({ caller }) func addSyllabus(subjectId : Nat, overview : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let syllabus = { subjectId; overview };
    syllabuses.add(subjectId, syllabus);
  };

  public shared ({ caller }) func updateSyllabus(subjectId : Nat, overview : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let syllabus = { subjectId; overview };
    syllabuses.add(subjectId, syllabus);
  };

  public shared ({ caller }) func deleteSyllabus(subjectId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    syllabuses.remove(subjectId);
  };

  public query func getSyllabusBySubject(subjectId : Nat) : async ?Syllabus {
    syllabuses.get(subjectId);
  };

  // Global Search - Public access
  public query func search(searchTerm : Text) : async SearchResult {
    let matchedSubjects = subjects.values().toArray().filter(func(subj) {
      containsIgnoreCase(subj.name, searchTerm);
    });

    let matchedNotes = notes.values().toArray().filter(func(note) {
      containsIgnoreCase(note.title, searchTerm) or
      note.tags.find<Text>(func(tag) {
        containsIgnoreCase(tag, searchTerm);
      }) != null;
    });

    let matchedPapers = questionPapers.values().toArray().filter(func(paper) {
      switch (paper.examType) {
        case (?examType) {
          containsIgnoreCase(examType, searchTerm);
        };
        case null { false };
      };
    });

    let matchedMCQs = mcqs.values().toArray().filter(func(mcq) {
      containsIgnoreCase(mcq.question, searchTerm);
    });

    {
      subjects = matchedSubjects;
      notes = matchedNotes;
      questionPapers = matchedPapers;
      mcqs = matchedMCQs;
    };
  };
};
