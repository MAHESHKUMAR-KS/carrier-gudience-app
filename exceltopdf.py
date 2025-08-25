import pandas as pd
from fpdf import FPDF

# ------------- CONFIGURATION ------------
FONT = "Times"  # Classic look
FONT_BOLD = "Times"
HEADING_SIZE = 16
SUBHEADING_SIZE = 13
NORMAL_SIZE = 11
CELL_HEIGHT = 10
LINE_HEIGHT = 8

# ------------- LOAD DATA ----------------
df = pd.read_excel("timetable.xlsx", header=None)

# ------------ PROCESS STAFF TABLES -------
def extract_staff_tables(df):
    tables = []
    i = 0
    while i < len(df):
        row = df.iloc[i]
        # Check if the first cell exactly equals "STAFF NAME" to find header row
        if str(row[0]).strip() == "STAFF NAME":
            i += 1  # skip header row
            days_entries = []
            staff_name = None
            while i < len(df):
                current_row = df.iloc[i]
                # Stop if next STAFF NAME row or empty first cell
                if (pd.isnull(current_row[0]) 
                    or str(current_row[0]).strip() == "STAFF NAME"):
                    break
                staff_name = str(current_row[0]).strip()  # Get staff name
                days_entries.append(current_row)
                i += 1
            if staff_name and days_entries:
                tables.append((staff_name, pd.DataFrame(days_entries).reset_index(drop=True)))
        i += 1
    return tables

staff_tables = extract_staff_tables(df)

# ------------- PDF GENERATION -----------
class TimetablePDF(FPDF):
    def header(self):
        self.set_font(FONT_BOLD, "B", HEADING_SIZE)
        self.cell(0, 10, "KONGU ENGINEERING COLLEGE (Autonomous)", align="C", ln=1)
        self.set_font(FONT_BOLD, "B", SUBHEADING_SIZE)
        self.cell(0, 8, "INTERNAL QUALITY ASSURANCE CELL", align="C", ln=1)
        self.cell(0, 8, "Faculty Time Table", align="C", ln=1)
        self.cell(0, 8, "Department of Artificial Intelligence", align="C", ln=1)
        self.ln(2)

    def add_staff_section(self, name, table_df):
        self.ln(2)
        self.set_font(FONT_BOLD, "B", NORMAL_SIZE)
        self.cell(0, 7, f"Name of the Faculty: {name}", ln=1)
        self.set_font(FONT, "", NORMAL_SIZE)
        self.cell(0, 6, "Academic Year & Semester : 2025-2026", ln=1)
        self.cell(0, 6, "Semester: Odd/Even      w.e.f:14.07.2025", ln=1)
        self.ln(2)

        col_headers = ["Day", "1st Hour", "2nd Hour", "3rd Hour", "4th Hour", "5th Hour", "6th Hour", "7th Hour"]
        self.set_font(FONT_BOLD, "B", NORMAL_SIZE)
        for h in col_headers:
            self.cell(25, CELL_HEIGHT, h, border=1, align="C")
        self.ln()

        self.set_font(FONT, "", NORMAL_SIZE)
        for _, row in table_df.iterrows():
            # Day is the second column (index 1), hours start from index 2 to 8
            cells = [row[1]] + list(row[2:9])
            for c in cells:
                self.cell(25, CELL_HEIGHT, str(c) if not pd.isnull(c) else "", border=1, align="C")
            self.ln()

        self.ln(6)
        self.set_font(FONT_BOLD, "B", NORMAL_SIZE)
        self.cell(0, 7, "Other Responsibilities:", ln=1)
        self.set_font(FONT, "", NORMAL_SIZE)
        self.multi_cell(0, LINE_HEIGHT, "Department Level:\n(i) \nInstitute Level:\n(i) \n\nTime-Table In-charge\nHOD")

        self.add_page()

pdf = TimetablePDF(orientation="L", unit="mm", format="A4")
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

for staff_name, table_df in staff_tables:
    pdf.add_staff_section(staff_name, table_df)

pdf.output("Faculty_Timetable.pdf")

print("PDF generated successfully as 'Faculty_Timetable.pdf'")
