from fastapi import APIRouter, UploadFile, HTTPException, File, Form
from app.utils.file_processing import process_file, get_site_details, get_anomalies_csv
from fastapi.responses import StreamingResponse

router = APIRouter()

# Endpoint untuk meng-upload dan memproses file
@router.post("/upload/")
async def upload_file(file: UploadFile = File(...), month: int = Form(...)):
    
    try:
        content = await file.read()
        result = process_file(content, month)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process file: {str(e)}")

# Endpoint for retrieving site details
@router.get("/site/{site_name}")
async def site_details(site_name: str):
    try:
        print(f"Fetching details for site: {site_name}")
        details = get_site_details(site_name)
        return details
    except Exception as e:
        print(f"Error fetching site details: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint for downloading anomalies CSV
@router.get("/download_csv/")
async def download_csv():
    try:
        csv_data = get_anomalies_csv()
        # response = StreamingResponse(iter([csv_data]), media_type="text/csv")
        response = StreamingResponse(iter([csv_data]), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        # response.headers["Content-Disposition"] = "attachment; filename=anomalies.csv"
        response.headers["Content-Disposition"] = "attachment; filename=anomalies.xlsx"
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))