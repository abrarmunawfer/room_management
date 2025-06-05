package com.ngs.backend.service;

import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.ngs.backend.entity.Shareholder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import java.util.List;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class ProfitService {

    @Autowired
    private IncomeService incomeService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ShareholderService shareholderService;

    public byte[] generateMonthlyProfitPdf(int month, int year) {
        Double totalIncome = incomeService.getTotalIncomeByMonth(month, year);
        Double totalExpense = expenseService.getTotalExpenseByMonth(month, year);

        if (totalIncome == null) totalIncome = 0d;
        if (totalExpense == null) totalExpense = 0d;

        Double profit = totalIncome - totalExpense;

        return createProfitPdf("Monthly Profit Report", month, year, totalIncome, totalExpense, profit);
    }

    public byte[] generateYearlyProfitPdf(int year) {
        Double totalIncome = incomeService.getTotalIncomeByYear(year);
        Double totalExpense = expenseService.getTotalExpenseByYear(year);

        if (totalIncome == null) totalIncome = 0d;
        if (totalExpense == null) totalExpense = 0d;

        Double profit = totalIncome - totalExpense;

        return createProfitPdf("Yearly Profit Report", null, year, totalIncome, totalExpense, profit);
    }

    private byte[] createProfitPdf(String title, Integer month, int year, Double totalIncome, Double totalExpense, Double profit) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 14);

            Paragraph heading = new Paragraph(title, titleFont);
            heading.setAlignment(Element.ALIGN_CENTER);
            document.add(heading);
            document.add(new Paragraph(" "));

            if (month != null) {
                document.add(new Paragraph("Month: " + month, bodyFont));
            }
            document.add(new Paragraph("Year: " + year, bodyFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Total Income: Rs. " + totalIncome, bodyFont));
            document.add(new Paragraph("Total Expenses: Rs. " + totalExpense, bodyFont));
            document.add(new Paragraph("Net Profit: Rs. " + profit, bodyFont));

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    public Map<String, Double> getProfitDistribution(int month, int year) {
        Double profit = incomeService.getTotalIncomeByMonth(month, year)
                - expenseService.getTotalExpenseByMonth(month, year);

        List<Shareholder> shareholders = shareholderService.getAll();

        Map<String, Double> distribution = new HashMap<>();

        for (Shareholder sh : shareholders) {
            double share = (profit * sh.getPercentage()) / 100;
            distribution.put(sh.getName(), share);
        }

        return distribution;
    }
}
