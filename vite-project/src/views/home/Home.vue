<template>
    <div>
        <h1 class="home_title" style="text-align: center">
            <el-button @click="getPreYearData" :icon="ArrowLeft"
                >上一年</el-button
            >
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>{{ year }}</span>
            <span>&nbsp;&nbsp;年学员数量</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-button @click="getNextYearData"
                >下一年 <el-icon><ArrowRight /></el-icon
            ></el-button>
        </h1>
        <div id="myChar" style="width: 100%; height: 600px"></div>
    </div>
</template>
<script setup lang="ts">
    import * as echarts from "echarts";
    import { onMounted, ref } from "vue";
    import { ArrowLeft } from "@element-plus/icons-vue";
    import { reqStudentForYear } from "@/api/student";
import { ElMessage } from "element-plus";
    const year = ref(new Date().getFullYear());
    const getPreYearData = () => {
        year.value--;
        drawChar()
    };
    const getNextYearData = () => {
        year.value++;
        drawChar()
    };

    const drawChar = () => {
        reqStudentForYear(year.value).then((response) => {
            if (response.status == "0") {
                let dataArr:number[] = []
                if(response.data && response.data.length){
                    response.data.forEach(item=>{
                        dataArr[parseInt(item._id) -1] = item.count
                    })
                }else{
                    ElMessage({
                        type:'warning',
                        message:'当前年份无数据'
                    })
                }
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById("myChar"));
                // 绘制图表
                myChart.setOption({
                    tooltip: {},
                    xAxis: {
                        data: [
                            "01",
                            "02",
                            "03",
                            "04",
                            "05",
                            "06",
                            "07",
                            "08",
                            "09",
                            "10",
                            "11",
                            "12",
                        ],
                    },
                    yAxis: {
                        type: "value",
                    },
                    series: [
                        {
                            type: "bar",
                            data: dataArr,
                        },
                    ],
                });
            }
        });
    };

    onMounted(() => {
        drawChar();
    });
</script>

<style scoped></style>
