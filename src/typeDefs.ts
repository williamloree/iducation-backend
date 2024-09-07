import { gql } from "apollo-server-core";

export const typeDefs = gql`
  scalar Datetime
  scalar JSON

  type Query {
    me: Me
    ping: String!
    users(input: UsersInput): [UserMe!]!
    courses: [Course]!
    tags: [Tags]!
    teachers: [User!]!
    categories: [Category]!
    teachersBySlug(input:TeacherSlugInput!): User!
    coursesBySlug(input:CourseSlugInput!): Course!
    coursesByTeacher(input:CourseTeacherInput!): [Course!]!
  }

  type Mutation {
    login(input: LoginInput!): Token
    addUser(input: AddUserInput!): UserMe!
    addCourse(input: AddCourseInput!): Course!
    updateAuth(input: UpdateAuthInput!): Boolean!
    updateUser(input: UpdateUserInput!): String!
    updateCourse(input: UpdateCourseInput!): Course!
    deleteUser: Boolean!
    deleteCourse(input:DeleteCourseInput!): Boolean!
  }

  type Token {
    token: String!
    refreshToken: String!
    tokenRevokedAt: Datetime!
    refreshRevokedAt: Datetime!
  }

  type Me {
    user: UserMe!
  }

  type UserMe {
    id: Int
    role: String!
    email: String!
    information: JSON
    slug: String!
    token: Token
    createdAt: Datetime
  }

  type User {
    id: Int
    role: String!
    email: String!
    information: JSON
    slug: String!
    createdAt: Datetime
  }

  type Course {
    id: Int
    titre: String!
    description: String
    magicString: String
    imageUrl: String
    intro: String
    slug: String
    pub: Boolean
    publish: Boolean
    inscrits: Int
    price: JSON
    details: JSON
    categories: JSON
    tags: JSON
    lessons: JSON
    teacher: User
    createdAt: Datetime
    updatedAt: Datetime
  }

  type Tags {
    id: Int
    title: String
    color: String
  }

  type Category {
    id: Int
    title: String
    color: String
    description: String
    icon: String
    courses: [Course]
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input AddUserInput {
    email: String!
    password: String!
    information: JSON
  }

  input AddCourseInput {
    titre: String!
    description: String
    imageUrl: String
    intro: String
    inscrits: Int
    price: JSON
    details: JSON
    categories: JSON
    tags: JSON
    lessons: JSON
  }

  input UsersInput {
    search: String
  }

  input TeacherSlugInput {
    slug: String
  }
  input CourseSlugInput {
    slug: String
  }
  input CourseTeacherInput {
    slug: String
  }

  input UpdateAuthInput {
    actualPassword: String!
    password: String!
    confirmPassword: String!
  }

  input UpdateCourseInput {
    id: Int!
    titre: String!
    description: String
    imageUrl: String
    intro: String
    inscrits: Int
    price: JSON
    details: JSON
    categories: JSON
    lessons: JSON
  }


  input UpdateUserInput {
    email: String!
  }

  input DeleteCourseInput {
    id: Int!
  }
`;
