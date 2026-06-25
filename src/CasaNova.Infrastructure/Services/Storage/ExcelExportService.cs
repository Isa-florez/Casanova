using CasaNova.Application.Interfaces;
using CasaNova.Domain.Entities;
using ClosedXML.Excel;

namespace CasaNova.Infrastructure.Services;

public class ExcelExportService : IExcelExportService
{
    public byte[] ExportBookings(IEnumerable<Booking> bookings)
    {
        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Reservas");

        ws.Cell(1, 1).Value = "ID Reserva";
        ws.Cell(1, 2).Value = "Inmueble";
        ws.Cell(1, 3).Value = "Huésped";
        ws.Cell(1, 4).Value = "Check-In";
        ws.Cell(1, 5).Value = "Check-Out";
        ws.Cell(1, 6).Value = "Noches";
        ws.Cell(1, 7).Value = "Total (COP)";
        ws.Cell(1, 8).Value = "Estado";
        ws.Cell(1, 9).Value = "Creada";

        var headerRow = ws.Range(1, 1, 1, 9);
        headerRow.Style.Font.Bold = true;
        headerRow.Style.Fill.BackgroundColor = XLColor.FromHtml("#2C3E50");
        headerRow.Style.Font.FontColor = XLColor.White;

        int row = 2;
        foreach (var b in bookings)
        {
            ws.Cell(row, 1).Value = b.Id.ToString();
            ws.Cell(row, 2).Value = b.Property?.Title ?? b.PropertyId.ToString();
            ws.Cell(row, 3).Value = b.User?.FullName ?? b.UserId.ToString();
            ws.Cell(row, 4).Value = b.CheckIn.ToString("yyyy-MM-dd HH:mm");
            ws.Cell(row, 5).Value = b.CheckOut.ToString("yyyy-MM-dd HH:mm");
            ws.Cell(row, 6).Value = b.Nights;
            ws.Cell(row, 7).Value = b.TotalPrice;
            ws.Cell(row, 8).Value = b.Status.ToString();
            ws.Cell(row, 9).Value = b.CreatedAt.ToString("yyyy-MM-dd");
            row++;
        }

        ws.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }
}