#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define FILE_NAME "phonebook.txt"
#define MAX_CONTACTS 100

typedef struct {
    char name[50];
    char countryCode[6];
    char phone[15];
    int isBlocked;
} Contact;
const char *allowedCountryCodes[] = { "+91", "+1", "+44", "+81", "+61", "+49" };
const int numAllowedCodes = sizeof(allowedCountryCodes) / sizeof(allowedCountryCodes[0]);

void clearInputBuffer() {
    int ch;
    while ((ch = getchar()) != '\n' && ch != EOF);
}

void inputString(const char *prompt, char *str, int maxLen) {
    printf("%s", prompt);
    if (fgets(str, maxLen, stdin)) {
        size_t len = strlen(str);
        if (len > 0 && str[len-1] == '\n') str[len-1] = '\0';
    }
}

int isValidPhone(const char *phone) {
    int len = strlen(phone);
    for (int i = 0; i < len; i++) {
        if (!isdigit(phone[i]))
            return 0;
    }

    if (len < 7 || len > 15)  
        return 0;

    return 1;
}
int isValidCountryCode(const char *code) {
    if (code[0] != '+')
        return 0;

    for (int i = 1; code[i] != '\0'; i++) {
        if (!isdigit(code[i]))
            return 0;
    }

    for (int i = 0; i < numAllowedCodes; i++) {
        if (strcmp(code, allowedCountryCodes[i]) == 0)
            return 1;
    }

    return 0;
}


int findContact(FILE *fp, const char *name, Contact *result) {
    rewind(fp);
    while (fread(result, sizeof(Contact), 1, fp)) {
        if (strcmp(result->name, name) == 0) {
            return 1;
        }
    }
    return 0;
}

void addContact() {
    FILE *fp = fopen(FILE_NAME, "a");
    if (!fp) {
        perror("Failed to open file");
        return;
    }

    Contact c;
    inputString("Enter name: ", c.name, sizeof(c.name));
    if (strlen(c.name) == 0) {
        printf("Name cannot be empty.\n");
        fclose(fp);
        return;
    }

    inputString("Enter country code (+91,+1,+44,+81,+61,+49): ", c.countryCode, sizeof(c.countryCode));
    if (c.countryCode[0] != '+' || !isValidCountryCode(c.countryCode )) {
        printf("Invalid country code.\n");
        fclose(fp);
        return;
    }

    inputString("Enter phone number: ", c.phone, sizeof(c.phone));
    if (!isValidPhone(c.phone)) {
        printf("Phone number should contain digits only.\n");
        fclose(fp);
        return;
    }

    c.isBlocked = 0;

    if (fwrite(&c, sizeof(Contact), 1, fp) != 1) {
        perror("Failed to write contact");
    } else {
        printf("Contact added successfully.\n");
    }

    fclose(fp);
}

void displayContacts() {
    FILE *fp = fopen(FILE_NAME, "r");
    if (!fp) {
        printf("No contacts found.\n");
        return;
    }

    Contact c;
    int count = 0;
    printf("\n--- Contact List ---\n");

    while (fread(&c, sizeof(Contact), 1, fp)) {
        printf("Name: %s\nPhone: %s %s\nStatus: %s\n\n", 
               c.name, c.countryCode, c.phone,
               c.isBlocked ? "Blocked" : "Active");
        count++;
    }

    if (count == 0) printf("No contacts to display.\n");
    fclose(fp);
}

void searchContact() {
    FILE *fp = fopen(FILE_NAME, "r");
    if (!fp) {
        printf("No contacts found.\n");
        return;
    }

    char searchName[50];
    Contact c;

    inputString("Enter name to search: ", searchName, sizeof(searchName));

    if (findContact(fp, searchName, &c)) {
        printf("\nContact found:\nName: %s\nPhone: %s %s\nStatus: %s\n", 
               c.name, c.countryCode, c.phone,
               c.isBlocked ? "Blocked" : "Active");
    } else {
        printf("Contact not found.\n");
    }
    fclose(fp);
}

void deleteContact() {
    FILE *fp = fopen(FILE_NAME, "r");
    if (!fp) {
        printf("No contacts to delete.\n");
        return;
    }

    char deleteName[50];
    Contact c;

    inputString("Enter name to delete: ", deleteName, sizeof(deleteName));

    if (!findContact(fp, deleteName, &c)) {
        printf("Contact not found.\n");
        fclose(fp);
        return;
    }

    printf("Found contact:\nName: %s\nPhone: %s %s\n", c.name, c.countryCode, c.phone);
    printf("Are you sure you want to delete? (y/n): ");
    char confirm = getchar();
    clearInputBuffer();

    if (confirm != 'y' && confirm != 'Y') {
        printf("Deletion cancelled.\n");
        fclose(fp);
        return;
    }

    // Proceed with deletion
    FILE *temp = fopen("temp.txt", "w");
    if (!temp) {
        perror("Failed to create temp file");
        fclose(fp);
        return;
    }

    rewind(fp);
    while (fread(&c, sizeof(Contact), 1, fp)) {
        if (strcmp(c.name, deleteName) != 0) {
            fwrite(&c, sizeof(Contact), 1, temp);
        }
    }

    fclose(fp);
    fclose(temp);

    if (remove(FILE_NAME) != 0 || rename("temp.txt", FILE_NAME) != 0) {
        perror("Failed to finalize deletion");
    } else {
        printf("Contact deleted successfully.\n");
    }
}

void editContact() {
    FILE *fp = fopen(FILE_NAME, "r+");
    if (!fp) {
        printf("No contacts found.\n");
        return;
    }

    char name[50];
    Contact c, original;

    inputString("Enter name to edit: ", name, sizeof(name));

    if (!findContact(fp, name, &original)) {
        printf("Contact not found.\n");
        fclose(fp);
        return;
    }

    c = original; // Start with original values

    printf("\nCurrent details:\n");
    printf("Name: %s\nCountry Code: %s\nPhone: %s\n\n", 
           c.name, c.countryCode, c.phone);

    char input[50];
    inputString("Enter new name (leave empty to keep current): ", input, sizeof(input));
    if (strlen(input) > 0) {
        strncpy(c.name, input, sizeof(c.name));
    }

    inputString("Enter new country code (leave empty to keep current): ", 
               input, sizeof(input));
    if (strlen(input) > 0) {
        if (input[0] != '+' || !isValidPhone(input + 1)) {
            printf("Invalid country code. Changes not saved.\n");
            fclose(fp);
            return;
        }
        strncpy(c.countryCode, input, sizeof(c.countryCode));
    }

    inputString("Enter new phone number (leave empty to keep current): ", 
               input, sizeof(input));
    if (strlen(input) > 0) {
        if (!isValidPhone(input)) {
            printf("Invalid phone number. Changes not saved.\n");
            fclose(fp);
            return;
        }
        strncpy(c.phone, input, sizeof(c.phone));
    }

    fseek(fp, -sizeof(Contact), SEEK_CUR);
    if (fwrite(&c, sizeof(Contact), 1, fp) != 1) {
        perror("Failed to save changes");
    } else {
        printf("Contact updated successfully.\n");
    }
    fclose(fp);
}

int compareContacts(const void *a, const void *b) {
    Contact *c1 = (Contact *)a;
    Contact *c2 = (Contact *)b;
    return strcasecmp(c1->name, c2->name);
}

void sortContacts() {
    FILE *fp = fopen(FILE_NAME, "r");
    if (!fp) {
        printf("No contacts found.\n");
        return;
    }

    Contact contacts[MAX_CONTACTS];
    int count = 0;

    while (count < MAX_CONTACTS && fread(&contacts[count], sizeof(Contact), 1, fp)) {
        count++;
    }
    fclose(fp);

    if (count == 0) {
        printf("No contacts to sort.\n");
        return;
    }

    qsort(contacts, count, sizeof(Contact), compareContacts);

    fp = fopen(FILE_NAME, "w");
    if (!fp) {
        perror("Failed to write sorted contacts");
        return;
    }

    fwrite(contacts, sizeof(Contact), count, fp);
    fclose(fp);

    printf("Contacts sorted successfully by name.\n");
}

int main() {
    int choice;
    do {
        printf("\n--- Phonebook Menu ---\n");
        printf("1. Add Contact\n");
        printf("2. Display All Contacts\n");
        printf("3. Search Contact\n");
        printf("4. Delete Contact\n");
        printf("7. Edit Contact\n");
        printf("8. Sort Contacts\n");
        printf("9. Exit\n");
        printf("Enter your choice: ");

        if (scanf("%d", &choice) != 1) {
            printf("Invalid input. Please enter a number.\n");
            clearInputBuffer();
            continue;
        }
        clearInputBuffer();

        switch (choice) {
            case 1: addContact(); break;
            case 2: displayContacts(); break;
            case 3: searchContact(); break;
            case 4: deleteContact(); break;
            case 7: editContact(); break;
            case 8: sortContacts(); break;
            case 9: printf("Exiting...\n"); break;
            default: printf("Invalid choice. Try again.\n");
        }
    } while (choice != 9);

    return 0;
}