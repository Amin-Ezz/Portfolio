from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from api.models import ContactMessage, Project, Skill, ProfileInfo


class PortfolioApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Seed sample project
        self.project = Project.objects.create(
            slug="test-proj",
            title="پروژه آزمایشی",
            subtitle="زیرعنوان آزمایشی",
            category="وب اپلیکیشن",
            role="توسعه‌دهنده فرانت‌اند",
            hero_image="/images/test.png",
            overview="توضیحات تستی برای راستی‌آزمایی",
            order=1
        )

        # Seed sample skill
        self.skill = Skill.objects.create(
            name="Django & DRF",
            category="backend",
            proficiency=95,
            order=1
        )

        # Seed sample profile
        self.profile = ProfileInfo.objects.create(
            full_name="امین اسماعیل زاده",
            role_title="توسعه‌دهنده خلاق",
            email="amin.esmaeilzadehh@gmail.com"
        )

    def test_health_check(self):
        url = reverse('health-check')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('status'), 'healthy')

    def test_contact_submission_success(self):
        url = reverse('contact-create')
        data = {
            "name": "علی محمدی",
            "email": "ali@example.com",
            "subject": "درخواست توسعه پروژه وب",
            "message": "سلام امین عزیز، قصد داریم یک وب‌اپلیکیشن فروشگاهی با رابط کاربری اختصاصی راه‌اندازی کنیم."
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data.get('success'))
        self.assertEqual(ContactMessage.objects.count(), 1)
        msg = ContactMessage.objects.first()
        self.assertEqual(msg.name, "علی محمدی")
        self.assertFalse(msg.is_read)

    def test_contact_submission_invalid(self):
        url = reverse('contact-create')
        # Missing required fields and message too short
        data = {
            "name": "A",
            "email": "invalid-email",
            "message": "Hi"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.get('success'))
        self.assertIn('errors', response.data)

    def test_project_list(self):
        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'test-proj')

    def test_project_detail_found(self):
        url = reverse('project-detail', kwargs={'slug': 'test-proj'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'پروژه آزمایشی')

    def test_project_detail_not_found(self):
        url = reverse('project-detail', kwargs={'slug': 'non-existent'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_skill_list(self):
        url = reverse('skill-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Django & DRF')

    def test_profile_info(self):
        url = reverse('profile-info')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['full_name'], 'امین اسماعیل زاده')
