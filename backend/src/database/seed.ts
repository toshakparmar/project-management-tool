import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from '../projects/schemas/project.schema';
import { Task } from '../tasks/schemas/task.schema';
import { User } from '../users/schemas/user.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const usersService = app.get(UsersService);
    const userModel = app.get(getModelToken(User.name));
    const projectModel = app.get(getModelToken(Project.name));
    const taskModel = app.get(getModelToken(Task.name));

    console.log('🌱 Starting database seed...');

    console.log('🧹 Clearing existing data...');
    await Promise.all([
      userModel.deleteMany({}),
      projectModel.deleteMany({}),
      taskModel.deleteMany({}),
    ]);

    console.log('👤 Creating test user...');
    const testUser = await usersService.create('test@example.com', 'Test@123');
    console.log(`✅ User created: ${testUser.email}`);

    console.log('📁 Creating projects...');

    const project1 = await projectModel.create({
      title: 'E-Commerce Platform',
      description: 'Build a modern e-commerce platform with shopping cart, payment integration, and order management.',
      status: 'active',
      userId: testUser._id.toString(),
    });
    console.log(`✅ Project created: ${project1.title}`);

    const project2 = await projectModel.create({
      title: 'Mobile App Development',
      description: 'Develop a cross-platform mobile application using React Native for iOS and Android.',
      status: 'active',
      userId: testUser._id.toString(),
    });
    console.log(`✅ Project created: ${project2.title}`);

    console.log('✅ Creating tasks for E-Commerce Platform...');

    const tasks1 = [
      {
        title: 'Setup Project Repository',
        description: 'Initialize Git repository and setup project structure with React and Node.js.',
        status: 'done',
        dueDate: new Date('2025-10-15'),
        projectId: project1._id,
        userId: testUser._id,
      },
      {
        title: 'Design Database Schema',
        description: 'Create MongoDB schema for users, products, orders, and shopping cart.',
        status: 'done',
        dueDate: new Date('2025-10-18'),
        projectId: project1._id.toString(),
        userId: testUser._id.toString(),
      },
      {
        title: 'Implement User Authentication',
        description: 'Build JWT-based authentication system with login, register, and password reset.',
        status: 'in-progress',
        dueDate: new Date('2025-10-25'),
        projectId: project1._id.toString(),
        userId: testUser._id.toString(),
      },
      {
        title: 'Create Product Catalog',
        description: 'Build product listing page with search, filters, and pagination.',
        status: 'todo',
        dueDate: new Date('2025-11-01'),
        projectId: project1._id.toString(),
        userId: testUser._id.toString(),
      },
      {
        title: 'Implement Shopping Cart',
        description: 'Develop shopping cart functionality with add, remove, and quantity management.',
        status: 'todo',
        dueDate: new Date('2025-11-10'),
        projectId: project1._id.toString(),
        userId: testUser._id.toString(),
      },
    ];

    await taskModel.insertMany(tasks1);
    console.log(`✅ Created ${tasks1.length} tasks for ${project1.title}`);

    console.log('✅ Creating tasks for Mobile App Development...');

    const tasks2 = [
      {
        title: 'Setup React Native Environment',
        description: 'Install React Native CLI, Android Studio, and Xcode for development.',
        status: 'done',
        dueDate: new Date('2025-10-20'),
        projectId: project2._id.toString(),
        userId: testUser._id.toString(),
      },
      {
        title: 'Design UI/UX Mockups',
        description: 'Create wireframes and high-fidelity designs in Figma for all app screens.',
        status: 'in-progress',
        dueDate: new Date('2025-10-28'),
        projectId: project2._id.toString(),
        userId: testUser._id.toString(),
      },
    ];

    await taskModel.insertMany(tasks2);
    console.log(`✅ Created ${tasks2.length} tasks for ${project2.title}`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Account Credentials:');
    console.log('   Email: test@example.com');
    console.log('   Password: Test@123');
    console.log('\n📊 Summary:');
    console.log(`   Users: 1`);
    console.log(`   Projects: 2`);
    console.log(`   Tasks: ${tasks1.length + tasks2.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
